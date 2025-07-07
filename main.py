from QueryGPT import QueryGPT
# Initialize QueryGPT
query_gpt = QueryGPT()

# Test with a simple query
result = query_gpt.generate_query("Show me all customers from New York who made purchases above $500", interactive=False)

# Interactive mode
# result = query_gpt.generate_query("Which products are running low on stock?", interactive=True)