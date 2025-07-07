import google.generativeai as genai
import os
import json

class ColumnPruneAgent:
    """Agent to prune irrelevant columns from tables"""

    def __init__(self, schema_info: dict):
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

    def prune_columns(self, user_query: str, tables: list) -> dict:
        """Identify and return only relevant columns from the selected tables"""
        # Create detailed schema descriptions for the selected tables
        schema_descriptions = []
        for table_name in tables:
            if table_name in self.schema_info:
                columns_desc = ", ".join([f"{c['name']} ({c['type']})" for c in self.schema_info[table_name]['columns']])
                schema_descriptions.append(f"Table '{table_name}': {columns_desc}")

        schema_text = "\n".join(schema_descriptions)

        prompt = f"""
        Based on the following user query and the tables that have been selected, determine which columns are relevant to answer the query.

        User Query: "{user_query}"

        Selected Tables Schema:
        {schema_text}

        For each table, return only the columns that are necessary to answer the query.
         Respond ONLY with a JSON object with the following structure:
        {{"pruned_schema": {{"table_name1": ["column1", "column2"], "table_name2": ["column1", "column3"]}}, "explanation": "Brief explanation of why these columns were chosen"}}
        """

        response = self.model.generate_content(prompt)

        # The response.text will be a JSON string due to the response_mime_type config
        return json.loads(response.text)