import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

def discover():
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        try:
            client = genai.Client(api_key=gemini_key)
            models = list(client.models.list())
            for m in models:
                print(m.name)
        except Exception as e:
            print("Gemini List Error:", e)

if __name__ == "__main__":
    discover()
