import google.generativeai as genai
import os

class GeminiModel():

    def __init__(self):

        api_key = os.environ["GOOGLE_API_KEY"]
        if not api_key:
            raise ValueError("Please set the GOOGLE_API_KEY environment variable.")

        genai.configure(api_key=api_key)

        # Set up the model with generation config
        generation_config = {
            "temperature": 0.1,
            "response_mime_type": "application/json", # Ensures the output is valid JSON
        }
        self.model = genai.GenerativeModel(
            'gemini-2.5-flash',
            generation_config=generation_config
        )

gemini_model_instance = GeminiModel()