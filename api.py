from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from request import SQLRequest, RegrasRequest
from fastapi.responses import JSONResponse, Response
from QueryGPT import QueryGPT

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
    conn = sqlite3.connect("/workspaces/QueryGPT/fisicos.db")
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS regras (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            regra TEXT,
            query TEXT
        )
    """)
    for item in regras:
        c.execute("INSERT INTO regras (regra, query) VALUES (?, ?)", (item.regra, item.query))
    conn.commit()
    conn.close()
    return {"status": "ok"}

@app.post("/api/search")
async def search(req: SQLRequest):

    query_gpt = QueryGPT()

    # Test with a simple query
    result = query_gpt.generate_query(req.question, interactive=False)

    return Response(content=str(result), media_type="text/plain")
    

@app.get('/api/', tags=["root"], summary="Health Check", description="Check if the service is running.")
async def get() -> JSONResponse:
    return JSONResponse(content="Running v1", status_code=200)