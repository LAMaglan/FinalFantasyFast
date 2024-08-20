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

@router.get("/get-characters")
async def fetch_and_store_characters(db: Session = Depends(get_db)):
    async with httpx.AsyncClient() as client:
        response = await client.get('https://www.moogleapi.com/api/v1/characters')
        response.raise_for_status()
        characters = response.json()
        for character in characters:
            if crud.create_character(db, character) is None:
                return {"error": "Cannot insert or update character."}
        return characters

@router.get("/stored-characters")
def read_characters(db: Session = Depends(get_db)):
    return crud.get_characters(db)

@router.get("/characters/", response_model=List[Character])
def get_characters_by_name(name: str, db: Session = Depends(get_db)):
    characters = crud.get_characters_by_name(db, name)
    if not characters:
        raise HTTPException(status_code=404, detail="Characters not found")
    return characters