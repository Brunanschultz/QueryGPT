from models.model import gemini_model_instance
import json

class IntentAgent:
    """Agent to determine the intent of a user's natural language query"""

    def __init__(self):

        self.model = gemini_model_instance.model

        self.workspaces = ["fisicos","outro"]

    def determine_intent(self, user_query: str) -> dict:
        """Mapeie a consulta em linguagem natural do usuário para um ou mais workspaces"""
        prompt = f"""
        Com base na seguinte consulta do usuário, determine a qual workspace ou workspaces ela pertence.
        Os workspaces disponíveis são: {', '.join(self.workspaces)}

        Consulta do Usuário: "{user_query}"

        Responda SOMENTE com um objeto JSON com a seguinte estrutura em português (BR):
        {{"workspaces": ["workspace1", "workspace2"], "explanation": "Breve explicação do motivo da escolha desses workspaces"}}
        """
        response = self.model.generate_content(prompt)

        # The response.text will be a JSON string due to the response_mime_type config
        return json.loads(response.text)

