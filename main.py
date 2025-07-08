from QueryGPT import QueryGPT
# Initialize QueryGPT
query_gpt = QueryGPT()

# Test with a simple query
result = query_gpt.generate_query(" Qual o churn médio de TERMINAL do segmento Small no último mês de 2024 ?", interactive=False)

# Interactive mode
# result = query_gpt.generate_query("Which products are running low on stock?", interactive=True)