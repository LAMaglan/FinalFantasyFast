from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from uuid import UUID
from database import get_db
from sqlalchemy.orm import Session
import crud
from typing import List, Optional

router = APIRouter()

class Game(BaseModel):
    gameId: UUID
    title: str
    picture: str
    platform: str
    releaseDate: str
    description: str

    class Config:
        orm_mode = True

@router.get("/stored-games")
def read_games(db: Session = Depends(get_db)):
    return crud.get_games(db)