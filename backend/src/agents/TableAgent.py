import google.generativeai as genai
import os
import json

class TableAgent:
    """Agent to determine which tables are needed to answer a query"""

    def __init__(self, schema_info: dict):
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
        self.schema_info = schema_info

    def determine_tables(self, user_query: str, workspace: str) -> dict:
        """Determina quais tabelas são necessárias na query"""
        # Create schema descriptions for the prompt
        schema_descriptions = []
        for table_name, info in self.schema_info.items():
            columns_desc = ", ".join([f"{c['name']} ({c['type']})" for c in info['columns']])
            schema_descriptions.append(f"Table '{table_name}': {columns_desc}")

        schema_text = "\n".join(schema_descriptions)

        prompt = f"""
        Com base na seguinte consulta do usuário e no esquema do banco de dados, determine quais tabelas são necessárias para responder à consulta.

        Consulta do Usuário: "{user_query}"
        Workspace: {workspace}

        Esquema do Banco de Dados:
        {schema_text}

        Responda SOMENTE com um objeto JSON com a seguinte estrutura em português (BR):
        {{"tables": ["tabela1", "tabela2"], "explanation": "Breve explicação do motivo da escolha dessas tabelas"}}
        """

        response = self.model.generate_content(prompt)

        # The response.text will be a JSON string due to the response_mime_type config
        return json.loads(response.text)