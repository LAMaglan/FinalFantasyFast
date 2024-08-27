from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import httpx
from database import get_db
import crud
from typing import List, Optional
from pydantic import BaseModel, Field
from uuid import UUID
import re

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
    stats: List[dict] = []  

    class Config:
        orm_mode = True

def roman_to_int(roman: str) -> int:
    ROMAN_NUMERAL_MAP = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
    num = 0
    for i in range(len(roman)):
        if i > 0 and ROMAN_NUMERAL_MAP[roman[i]] > ROMAN_NUMERAL_MAP[roman[i - 1]]:
            num += ROMAN_NUMERAL_MAP[roman[i]] - 2 * ROMAN_NUMERAL_MAP[roman[i - 1]]
        else:
            num += ROMAN_NUMERAL_MAP[roman[i]]
    return num

def is_roman_numeral(s: str) -> bool:
    return re.fullmatch(r'[IVXLCDM]+', s) is not None

def sort_roman_numerals(games: List[str]) -> List[str]:
    def extract_main_part(game: str) -> str:
        return game.rsplit(" ", 1)[-1]

    def sort_key(game: str):
        main_part = extract_main_part(game)
        if game == "Final Fantasy":
            return 1
        if is_roman_numeral(main_part):
            return roman_to_int(main_part)
        # Ensure non-numeric entries are sorted last
        return float('inf')  
    
    # First sort numerically, then alphabetically for tie-breakers
    return sorted(games, key=lambda x: (sort_key(x), x))




@router.get("/stored-characters")
def read_characters(db: Session = Depends(get_db)):
    return crud.get_characters(db)

@router.get("/characters/origins", response_model=List[str])
def get_character_origins(db: Session = Depends(get_db)):
    characters = crud.get_characters(db)
    unique_origins = {character.origin for character in characters if character.origin}
    return sort_roman_numerals(list(unique_origins))

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