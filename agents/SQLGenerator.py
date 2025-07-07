from utils.llmOutput import format_llm_output_to_dict
from sklearn.metrics.pairwise import cosine_similarity
from utils.vectors import QueryVectorizer
import google.generativeai as genai
import json 
import os

vectorizer = QueryVectorizer()

class SQLGenerator:
    """Generate SQL from natural language using LLM"""

    def __init__(self, schema_info: dict, sample_queries: list):
        # Configure the Google AI API using an environment variable for security
        genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

        # Set up the model with generation config
        # 'gemini-2.0-flash' is fast and cost-effective.
        # For maximum quality, you might consider 'gemini-1.5-pro-latest'.
        generation_config = {
            "temperature": 0.1,
            "response_mime_type": "application/json", # Ensures the output is valid JSON
        }
        self.model = genai.GenerativeModel(
            'gemini-2.0-flash',
            generation_config=generation_config
        )
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
            samples_text += f"Example {i+1}:\n"
            samples_text += f"Question: {sample['natural_language']}\n"
            samples_text += f"SQL: {sample['sql']}\n\n"

        prompt = f"""
        You are an expert SQL query generator. Your task is to convert natural language questions into accurate SQL queries.

        Database Schema:
        {schema_text}

        Here are some examples of questions and their corresponding SQL queries:
        {samples_text}

        Now, generate an SQL query for the following question:
        Question: {user_query}

        Respond ONLY with a JSON object with the following structure:
        {{"sql": "The generated SQL query", "explanation": "A step-by-step explanation of how the query works"}}
        """

        response = self.model.generate_content(prompt)
    
        # The response.text will be a JSON string due to the response_mime_type config
        return json.loads(response.text)
