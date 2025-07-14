from sklearn.metrics.pairwise import cosine_similarity
from utils.vectors import QueryVectorizer
from models.model import gemini_model_instance
import google.generativeai as genai
import json 
import os

vectorizer = QueryVectorizer()

class SQLGenerator:
    """Generate SQL from natural language using LLM"""

    def __init__(self, schema_info: dict, sample_queries: list):
        
        self.model = gemini_model_instance.model
        self.schema_info = schema_info
        self.sample_queries = sample_queries

    def find_similar_samples(self, user_query: str, embeddings_data: dict, top_k: int = 3) -> list:
        """Find most similar sample queries to use as examples"""
        query_vector = vectorizer.vectorize(user_query)

        # Calculate similarities with existing queries
        similarities = cosine_similarity([query_vector], embeddings_data["query_embeddings"])[0]
        # Get top-k similar queries
        top_indices = similarities.argsort()[-top_k:][::-1]
        similar_samples = [self.sample_queries[i] for i in top_indices]

        return similar_samples

    def generate_sql(self, user_query: str, workspace: str, tables: list, pruned_schema: dict, similar_samples: list) -> dict:
        """Generate SQL query using LLM"""
        # Format schema information for the prompt
        schema_text = ""
        for table_name, columns in pruned_schema.items():
            column_info = [col for col in self.schema_info[table_name]['columns'] if col['name'] in columns]
            column_desc = ", ".join([f"{c['name']} ({c['type']})" for c in column_info])
            schema_text += f"Table '{table_name}': {column_desc}\n"

        # Format sample queries for few-shot learning
        samples_text = ""

        for i, sample in enumerate(similar_samples):
            samples_text += f"Description {i+1}:\n"
            samples_text += f"Question: {sample['natural_language']}\n"
            samples_text += f"SQL: {sample['sql']}\n\n"

        current_dir = os.path.dirname(__file__)

        with open(os.path.join(current_dir, '../database/', 'rules.json'), 'r') as file:
            data = json.load(file)['boasPraticas']
            for i in data:
                samples_text += f"Description: {i['descricao']}:\n"
                samples_text += f"Example: {i['exemplo']}:\n"
        

        prompt = f"""
        Você é um especialista em geração de consultas SQL. Sua tarefa é converter perguntas em linguagem natural em consultas SQL precisas.

        Esquema do Banco de Dados:
        {schema_text}

        Aqui estão alguns exemplos do que fazer e suas respectivas consultas SQL:
        {samples_text}

        Agora, gere uma consulta SQL para a seguinte pergunta:
        Pergunta: {user_query}

        Responda SOMENTE com um objeto JSON com a seguinte estrutura em português (BR):
        {{"sql": "A consulta SQL gerada", "explanation": "Uma explicação passo a passo de como a consulta funciona"}}
        """


        response = self.model.generate_content(prompt)
    
        # The response.text will be a JSON string due to the response_mime_type config
        return json.loads(response.text)
