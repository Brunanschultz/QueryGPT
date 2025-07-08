from utils.llmOutput import format_llm_output_to_dict
import google.generativeai as genai
import os
import json

class IntentAgent:
    """Agent to determine the intent of a user's natural language query"""

    def __init__(self):
        # Configure the Google AI API using an environment variable for security
        genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

        # Set up the model with generation config
        generation_config = {
            "temperature": 0.1,
            "response_mime_type": "application/json", # Ensures the output is valid JSON
        }
        self.model = genai.GenerativeModel(
            'gemini-2.0-flash',
            generation_config=generation_config
        )
        # Define possible workspaces
        self.workspaces = ["fisicos","outro"]

    def determine_intent(self, user_query: str) -> dict:
        """Map user's natural language query to a workspace(s)"""
        prompt = f"""
        Based on the following user query, determine which workspace or workspaces it belongs to.
        The available workspaces are: {', '.join(self.workspaces)}

        User Query: "{user_query}"

        Respond ONLY with a JSON object with the following structure:
        {{"workspaces": ["workspace1", "workspace2"], "explanation": "Brief explanation of why these workspaces were chosen"}}
        """
        response = self.model.generate_content(prompt)

        # The response.text will be a JSON string due to the response_mime_type config
        return json.loads(response.text)

