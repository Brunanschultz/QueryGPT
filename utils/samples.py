import json
import os 

# Caminho absoluto do diretório atual (utils)
current_dir = os.path.dirname(__file__)

def create_sample_sql_queries():
    """Create a set of sample SQL queries for our RAG"""

    with open(os.path.join(current_dir, '..', 'rules.json'), 'r') as file:
            sample_queries = json.load(file)['exemplos']
           
    return sample_queries

# Create sample queries
sample_queries = create_sample_sql_queries()


