import google.generativeai as genai
import os
import json
from models.model import gemini_model_instance
import pandas as pd
from database.connection import Connection

class ColumnPruneAgent:
    """Agent to prune irrelevant columns from tables"""

    def __init__(self, schema_info: dict):
        
        self.model = gemini_model_instance.model
        self.schema_info = schema_info

    def prune_columns(self, user_query: str, tables: list) -> dict:
        """Identify and return only relevant columns from the selected tables"""
        # Create detailed schema descriptions for the selected tables
        schema_descriptions = []
        for table_name in tables:
            if table_name in self.schema_info:
                columns_desc = ", ".join([f"{c['name']} ({c['type']}) - Examples: {c['examples']}" for c in self.schema_info[table_name]['columns']])
                schema_descriptions.append(f"Table '{table_name}': {columns_desc}")

        schema_text = "\n".join(schema_descriptions)

        business_rules = []

        current_dir = os.path.dirname(__file__)

        with open(os.path.join(current_dir, '../database/', 'rules.json'), 'r') as file:
            data = json.load(file)['regrasNegocio']
            for i in data:
                business_rules.append(i['descricao'])

        query = "SELECT descricao, query FROM regras"

        db = Connection()
        if db.connect():
            df = db.read_sql(query)
            db.disconnect()

        # Formatar as regras para o prompt
        regras_prompt = ""
        for idx, row in df.iterrows():
            regras_prompt += f"Regra {idx+1}:\nDescrição: {row['descricao']}\nQuery: {row['query']}\n\n"


        prompt = f"""
        Com base na seguinte consulta do usuário e nas tabelas que foram selecionadas, determine quais colunas são relevantes para responder à consulta.

        Consulta do Usuário: "{user_query}"

        Esquema das Tabelas Selecionadas:
        {schema_text}

        Regras de Negócio:
        {', '.join(business_rules)}
        {regras_prompt}

        Para cada tabela, retorne apenas as colunas que são necessárias para responder à consulta.
        Responda SOMENTE com um objeto JSON com a seguinte estrutura em português (BR):
        {{"pruned_schema": {{"nome_tabela1": ["coluna1", "coluna2"], "nome_tabela2": ["coluna1", "coluna3"]}}, "explanation": "Breve explicação do motivo da escolha dessas colunas"}}
        """

        response = self.model.generate_content(prompt)

        # The response.text will be a JSON string due to the response_mime_type config
        return json.loads(response.text)