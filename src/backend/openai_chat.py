import openai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

def get_api_base():
    model = os.getenv("DEFAULT_MODEL", "openai")
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
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # This might need to be adjusted for LM-Studio
            messages=messages
        )
        return response.choices[0].message['content']
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