from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import httpx
from database import get_db
import crud
from typing import List, Optional
from pydantic import BaseModel, Field
from uuid import UUID

router = APIRouter()

class Picture(BaseModel):
    id: UUID
    url: str
    primary: int
    collectionId: UUID

class Character(BaseModel):
    id: UUID
    name: str
    japaneseName: Optional[str] = None
    age: str
    gender: str
    race: str
    job: str
    height: str
    weight: str
    origin: str
    description: Optional[str] = None
    pictures: List[Picture] = []
    stats: List[dict] = []  # Assuming stats is a list of dictionaries, update this if the structure is more complex

    class Config:
        orm_mode = True

@router.get("/stored-characters")
def read_characters(db: Session = Depends(get_db)):
    return crud.get_characters(db)

@router.get("/characters/origins", response_model=List[str])
def get_character_origins(db: Session = Depends(get_db)):
    characters = crud.get_characters(db)
    unique_origins = {character.origin for character in characters if character.origin}
    return list(unique_origins)

@router.get("/characters/", response_model=List[Character])
def get_characters(name: Optional[str] = None, origin: Optional[str] = None, db: Session = Depends(get_db)):
    filters = {}
    if name:
        filters['name'] = name
    if origin:
        filters['origin'] = origin

    characters = crud.get_characters(db, **filters)
    if not characters:
        raise HTTPException(status_code=404, detail="Characters not found")
    return characters