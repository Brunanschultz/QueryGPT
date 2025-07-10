from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from request import SQLRequest, RegrasRequest
from fastapi.responses import JSONResponse, Response
from QueryGPT import QueryGPT

def gerar_relatorio(api_response):

    return f'''
    Consulta do usuário: {api_response["user_query"]}

    Etapas:
    1. Intenção: {api_response["intent"]["explanation"]}
    2. Tabela utilizada: {api_response["tables"]["explanation"]}
    3. Colunas selecionadas: {api_response["pruned_schema"]["explanation"]}
    4. Consulta SQL executada: {api_response["sql_result"]["sql"]}
    Explicação: {api_response["sql_result"]["explanation"]}

    Resultado:
    {api_response['query_result']}.
    '''.strip()


app = FastAPI(
    title="API",
    description="API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.post("/api/regras")
async def salvar_regras(regras_req: RegrasRequest):
    regras = regras_req.regras
    import sqlite3
    conn = sqlite3.connect("fisicos.db")
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS regras (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descricao TEXT,
            query TEXT
        )
    """)
    for item in regras:
        c.execute("INSERT INTO regras (descricao, query) VALUES (?, ?)", (item.descricao, item.query))
    conn.commit()
    conn.close()
    return {"status": "ok"}

@app.post("/api/search")
async def search(req: SQLRequest):

    query_gpt = QueryGPT()

    # Test with a simple query
    result = query_gpt.generate_query(req.question, interactive=False)

    return JSONResponse(content=gerar_relatorio(result))

@app.get('/api/', tags=["root"], summary="Health Check", description="Check if the service is running.")
async def get() -> JSONResponse:
    return JSONResponse(content="Running v1", status_code=200)