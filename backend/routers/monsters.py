from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import httpx
from database import get_db
import crud
from typing import Optional, List
from pydantic import BaseModel, Field
from uuid import UUID

router = APIRouter()

class Monster(BaseModel):
    monsterId: UUID
    name: str
    japaneseName: Optional[str] = None
    elementalAffinity: Optional[str] = None
    elementalWeakness: Optional[str] = None
    hitPoints: Optional[int] = None
    manaPoints: Optional[int] = None
    attack: Optional[int] = None
    defense: Optional[int] = None
    picture: Optional[str] = None
    description: Optional[str] = None
    game: Optional[str] = None

    class Config:
        orm_mode = True

def sort_zero_padded_numbers(games: List[str]) -> List[str]:
    def extract_main_part(game: str) -> int:
        main_part = game.rsplit(" ", 1)[-1]
        try:
            return int(main_part)
        except ValueError:
            # Ensure non-numeric entries are sorted last
            return float('inf')  

    # First sort numerically, then alphabetically for tie-breakers
    return sorted(games, key=lambda x: (extract_main_part(x), x))

@router.get("/stored-monsters", response_model=List[Monster])
def read_monsters(db: Session = Depends(get_db)):
    return crud.get_monsters(db)

@router.get("/monsters/games", response_model=List[str])
def get_monster_games(db: Session = Depends(get_db)):
    monsters = crud.get_monsters(db)
    unique_games = {monster.game for monster in monsters if monster.game}
    return sort_zero_padded_numbers(list(unique_games))