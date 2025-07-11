from utils.samples import create_sample_sql_queries
from utils.schema import schema_info
from utils.vectors import QueryVectorizer

# Initialize vectorizer
vectorizer = QueryVectorizer()
sample_queries = create_sample_sql_queries()

def create_embeddings():
    # Vectorize sample SQL queries
    query_texts = [q["natural_language"] for q in sample_queries]
    query_embeddings = vectorizer.bulk_vectorize(query_texts)

    # Vectorize table schemas
    table_descriptions = []
    for table_name, info in schema_info.items():
        # Create a text description of the table schema
        column_descriptions = ", ".join([f"{c['name']} ({c['type']})" for c in info['columns']])
        table_desc = f"Table {table_name} with columns: {column_descriptions}"
        table_descriptions.append(table_desc)

    table_embeddings = vectorizer.bulk_vectorize(table_descriptions)

    return {
        "query_embeddings": query_embeddings,
        "query_texts": query_texts,
        "table_embeddings": table_embeddings,
        "table_descriptions": table_descriptions,
        "table_names": list(schema_info.keys())
    }


# Create embeddings
embeddings_data = create_embeddings()
