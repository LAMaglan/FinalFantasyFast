from fastapi import FastAPI
from routers import characters, monsters
from database import engine, Base
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(characters.router, prefix="/api", tags=["characters"])
app.include_router(monsters.router, prefix="/api", tags=["monsters"])

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Final Fantasy": "FastAPI"}