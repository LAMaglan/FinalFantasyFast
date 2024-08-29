from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import crud
from database import get_db
from typing import List, Optional
from pydantic import BaseModel
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
    age: Optional[str] = None
    gender: Optional[str] = None
    race: Optional[str] = None
    job: Optional[str] = None
    height: Optional[str] = None
    weight: Optional[str] = None
    origin: Optional[str] = None
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

def extract_parts(game: str):
    main_part = game.rsplit(" ", 1)[-1]
    if '-' in main_part:
        primary, secondary = main_part.split('-')
    else:
        primary, secondary = main_part, None
    return primary, secondary

def sort_roman_numerals(games: List[str]) -> List[str]:
    def sort_key(game: str):
        primary, secondary = extract_parts(game)
        
        if game == "Final Fantasy":
            primary_val = 1
        elif is_roman_numeral(primary):
            primary_val = roman_to_int(primary)
        else:
            primary_val = float('inf')

        secondary_val = int(secondary) if secondary and secondary.isdigit() else 0
        return (primary_val, secondary_val, game)

    return sorted(games, key=sort_key)

@router.get("/stored-characters", response_model=List[Character])
def read_characters(db: Session = Depends(get_db)):
    return crud.get_characters(db)

@router.get("/characters/origins", response_model=List[str])
def get_character_origins(db: Session = Depends(get_db)):
    characters = crud.get_characters(db)
    unique_origins = {character.origin for character in characters if character.origin}
    return sort_roman_numerals(list(unique_origins))