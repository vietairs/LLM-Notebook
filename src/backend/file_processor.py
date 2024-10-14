import json
import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from openai_chat import generate_response

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})  # Enable CORS for specific origin

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/chat', methods=['POST'])
def process_file():
    try:
        data = request.get_json()
        
        user_message = data['message']
        chat_history = data['chatHistory']
        
        response = generate_response(user_message, chat_history)
        
        # Log the request and response
        app.logger.info(f"Received request: {data}")
        app.logger.info(f"Generated response: {response}")
        
        return jsonify({"response": response})
    except Exception as e:
        app.logger.error(f"Error processing request: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        response = send_file_to_lmstudio(file_path)
        return jsonify({"response": response})

def send_file_to_lmstudio(file_path):
    try:
        lmstudio_api_base = os.getenv("LMSTUDIO_API_BASE")
        lmstudio_api_key = os.getenv("LMSTUDIO_API_KEY")
        headers = {
            "Authorization": f"Bearer {lmstudio_api_key}",
            "Content-Type": "application/json"
        }
        with open(file_path, 'r') as file:
            file_content = file.read()
        data = {
            "model": "lmstudio-model",  # Adjust this to the specific model name for LM-Studio
            "text": file_content
        }
        response = requests.post(f"{lmstudio_api_base}/embed", headers=headers, json=data)
        response = response.json()
        return response
    except Exception as e:
        app.logger.error(f"Error in send_file_to_lmstudio: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    app.run(port=8000)
