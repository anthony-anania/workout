from flask import Flask, request, jsonify, Response
import cv2
import mediapipe as mp
import numpy as np
import os
import tempfile
import threading
import time
from flask_cors import CORS

from body_part_angle import BodyPartAngle
from types_of_exercise import TypeOfExercise
from utils import score_table

app = Flask(__name__)
CORS(app)  

camera = None
counter = 0
status = True
exercise_type = "push-up"
camera_lock = threading.Lock()
processing = False
frames_buffer = []
max_buffer_size = 5

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

EXERCISES = ["push-up", "pull-up", "squat", "walk", "sit-up"]

os.makedirs('uploads', exist_ok=True)



@app.route('/api/exercises', methods=['GET'])
def get_exercises():
    return jsonify(EXERCISES)

@app.route('/api/start_webcam', methods=['POST'])
def start_webcam():
    global camera, exercise_type, counter, status, processing, frames_buffer
    
    data = request.json
    selected_exercise = data.get('exercise', 'push-up')
    
    if selected_exercise not in EXERCISES:
        return jsonify({'status': 'error', 'message': f'Invalid exercise: {selected_exercise}'})
    
    with camera_lock:
        if camera is not None:
            camera.release()
        
        camera = cv2.VideoCapture(0)
        if not camera.isOpened():
            return jsonify({'status': 'error', 'message': 'Could not open webcam'})
            
        exercise_type = selected_exercise
        counter = 0
        status = True
        processing = True
        frames_buffer = []
        
        processing_thread = threading.Thread(target=process_video)
        processing_thread.daemon = True
        processing_thread.start()
    
    return jsonify({
        'status': 'success', 
        'message': f'Started webcam for {selected_exercise}',
        'stream_url': '/api/video_feed'
    })

@app.route('/api/stop_webcam', methods=['POST'])
def stop_webcam():
    global camera, processing
    
    with camera_lock:
        if camera is not None:
            camera.release()
            camera = None
        processing = False
    
    return jsonify({'status': 'success', 'message': 'Stopped webcam'})


@app.route('/api/stats', methods=['GET'])
def get_stats():
    global counter, status, exercise_type
    return jsonify({
        'counter': counter, 
        'status': str(status),
        'exercise': exercise_type
    })

@app.route('/api/reset', methods=['GET'])
def reset():
    global counter
    counter = 0
    return jsonify({'counter': counter})

def process_video():
    global camera, counter, status, exercise_type, processing, frames_buffer
    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        while processing:
            with camera_lock:
                if camera is None:
                    break
                
                success, frame = camera.read()
                if not success:
                    if camera.get(cv2.CAP_PROP_POS_FRAMES) == camera.get(cv2.CAP_PROP_FRAME_COUNT):
                        processing = False
                        break
                    continue
            
            frame = cv2.resize(frame, (800, 480), interpolation=cv2.INTER_AREA)
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            rgb_frame.flags.writeable = False
            results = pose.process(rgb_frame)
            rgb_frame.flags.writeable = True
            frame_with_landmarks = cv2.cvtColor(rgb_frame, cv2.COLOR_RGB2BGR)
            
            try:
                if results.pose_landmarks:
                    landmarks = results.pose_landmarks.landmark
                    exercise_counter, exercise_status = TypeOfExercise(landmarks).calculate_exercise(
                        exercise_type, counter, status)
                    counter, status = exercise_counter, exercise_status

                    frame_with_landmarks = score_table(exercise_type, frame_with_landmarks, counter, status)

                    mp_drawing.draw_landmarks(
                        frame_with_landmarks,
                        results.pose_landmarks,
                        mp_pose.POSE_CONNECTIONS,
                        mp_drawing.DrawingSpec(color=(255, 255, 255), thickness=2, circle_radius=2),
                        mp_drawing.DrawingSpec(color=(174, 139, 45), thickness=2, circle_radius=2),
                    )
            except Exception as e:
                print(f"Error in pose detection: {e}")
                continue
            
            ret, buffer = cv2.imencode('.jpg', frame_with_landmarks)
            if ret:
                with camera_lock:
                    frames_buffer.append(buffer.tobytes())

                    if len(frames_buffer) > max_buffer_size:
                        frames_buffer.pop(0)
            
            time.sleep(0.03)  

def generate_frames():
    global frames_buffer, processing
    
    while True:
        if not processing and len(frames_buffer) == 0:
            break
            
        if frames_buffer:
            with camera_lock:
                if frames_buffer:
                    frame = frames_buffer.pop()
                else:
                    continue
                    
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        else:
            time.sleep(0.03)  

@app.route('/api/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)