import openai
import os
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv()

# Set up OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

def get_api_base():
    model = os.getenv("DEFAULT_MODEL", "lmstudio")
    if model == "openai":
        return os.getenv("OPENAI_API_BASE")
    elif model == "lmstudio":
        return os.getenv("LMSTUDIO_API_BASE")
    else:
        raise ValueError(f"Unknown model: {model}")

def chat_with_gpt(messages):
    try:
        api_base = get_api_base()
        openai.api_base = api_base
        
        if os.getenv("DEFAULT_MODEL", "openai") == "openai":
            response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # This might need to be adjusted for LM-Studio
            messages=messages
            )
        elif os.getenv("DEFAULT_MODEL") == "lmstudio":
            lmstudio_api_base = os.getenv("LMSTUDIO_API_BASE")
            lmstudio_api_key = os.getenv("LMSTUDIO_API_KEY")
            headers = {
            "Authorization": f"Bearer {lmstudio_api_key}",
            "Content-Type": "application/json"
            }
            data = {
            "model": "lmstudio-model",  # Adjust this to the specific model name for LM-Studio
            "messages": messages 
            }
            response = requests.post(f"{lmstudio_api_base}/chat/completions", headers=headers, json=data)
            response = response.json()
        else:
            raise ValueError("Unsupported model specified.")
        if os.getenv("DEFAULT_MODEL", "openai") == "openai":
            return response.choices[0].message['content']
        elif os.getenv("DEFAULT_MODEL") == "lmstudio":
            return response['choices'][0]['message']['content']
    except Exception as e:
        print(f"Error in chat_with_gpt: {e}")
        return "I'm sorry, but I encountered an error while processing your request."

def generate_response(user_message, chat_history):
    messages = [
        {"role": "system", "content": "You are a helpful AI assistant for a note-taking application."},
    ]
    
    # Add chat history
    for message in chat_history:
        messages.append({"role": message['role'], "content": message['content']})
    
    # Add the new user message
    messages.append({"role": "user", "content": user_message})
    
    # Get response from GPT
    ai_response = chat_with_gpt(messages)
    
    return ai_response

if __name__=="__main__":
    # Test the response generation
    user_message = "What is the capital of France?"
    chat_history = []
    response = generate_response(user_message, chat_history)
    print(response)