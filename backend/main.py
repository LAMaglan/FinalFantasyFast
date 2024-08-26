from fastapi import FastAPI
from routers import characters, monsters, games
from database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, CharacterSQL 

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(characters.router, prefix="/api", tags=["characters"])
app.include_router(monsters.router, prefix="/api", tags=["monsters"])
app.include_router(games.router, prefix="/api", tags=["games"])

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

@app.get("/health")
def health_check():
    db: Session = SessionLocal()
    try:
        # Perform a simple query to check database state
        character_count = db.query(CharacterSQL).count()
        if character_count >= 0:
            return {"status": "healthy"}
    except Exception as e:
        return {"status": "unhealthy", "detail": str(e)}
    finally:
        db.close()

    return {"status": "unhealthy"}