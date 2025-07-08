from pydantic import BaseModel
from typing import List

# Estrutura do request
class SQLRequest(BaseModel):
    question: str


class InsertBD(BaseModel):
    regra: str
    query: str


class RegrasRequest(BaseModel):
    regras: List[InsertBD]