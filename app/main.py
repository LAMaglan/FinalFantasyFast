from fastapi import FastAPI
from app.routers import characters, monsters

app = FastAPI()

app.include_router(characters.router, prefix="/api", tags=["characters"])
app.include_router(monsters.router, prefix="/api", tags=["monsters"])

@app.get("/")
def read_root():
    return {"Final Fantasy": "FastAPI"}