from agents.SQLGenerator import SQLGenerator
from agents.TableAgent import TableAgent
from agents.ColumnPruneAgent import ColumnPruneAgent
from agents.IntentAgent import IntentAgent
from utils.schema import get_database_schema
from utils.samples import create_sample_sql_queries
from utils.embeddings import create_embeddings
import sqlite3
import pandas as pd
import json

class QueryGPT:
    """Main class that orchestrates the NL to SQL conversion pipeline"""

    def __init__(self):
        self.schema_info = get_database_schema()
        self.sample_queries = create_sample_sql_queries()
        self.embeddings_data = create_embeddings()

        # Initialize agents
        self.intent_agent = IntentAgent()
        self.table_agent = TableAgent(self.schema_info)
        self.column_prune_agent = ColumnPruneAgent(self.schema_info)
        self.sql_generator = SQLGenerator(self.schema_info, self.sample_queries)

    def generate_query(self, user_query: str, interactive: bool = False) -> dict:
        """Process a natural language query and generate SQL"""
        results = {"user_query": user_query}

        # Step 1: Determine intent (workspace)
        intent_result = self.intent_agent.determine_intent(user_query)
        workspace = intent_result["workspaces"][0]  # Use the first workspace for now
        results["intent"] = intent_result
        print(f"🧠 Intenção detectada: {workspace}")

        # Step 2: Determine tables
        table_result = self.table_agent.determine_tables(user_query, workspace)
        tables = table_result["tables"]
        results["tables"] = table_result
        print(f"📊 Tabelas Identificadas: {', '.join(tables)}")

        # Allow user to adjust tables in interactive mode
        if interactive:
            print("\nDo the identified tables look correct? (Y/N)")
            user_response = input()
            if user_response.lower() != 'y':
                print("Enter comma-separated table names:")
                tables = [t.strip() for t in input().split(',')]

        # Step 3: Prune columns
        column_result = self.column_prune_agent.prune_columns(user_query, tables)
        pruned_schema = column_result["pruned_schema"]
        results["pruned_schema"] = column_result
        print(f"🔍 Seleção de colunas realizada")

        # Step 4: Find similar sample queries
        similar_samples = self.sql_generator.find_similar_samples(user_query, self.embeddings_data)
        results["similar_samples"] = [s["natural_language"] for s in similar_samples]
        print(f"📝 Encontrada {len(similar_samples)} queries similares")

        # Step 5: Generate SQL
        sql_result = self.sql_generator.generate_sql(
            user_query,
            workspace,
            tables,
            pruned_schema,
            similar_samples
        )
        results["sql_result"] = sql_result
        print("\n✅ SQL Query Gerada:")
        print("\n" + sql_result["sql"] + "\n")

        # Step 6: Execute query to validate (optional)
        try:
            conn = sqlite3.connect('fisicos.db')
            df = pd.read_sql_query(sql_result["sql"], conn)
            results["execution_success"] = True
            results["query_result"] = df.head(5).to_dict()
            print("\n🚀 Query executada com sucesso. Primeiros cinco resultados:")
            print(df.head(5))
        except Exception as e:
            results["execution_success"] = False
            results["execution_error"] = str(e)
            print(f"\n❌ Query falhou: {str(e)}")

        return results