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
    japaneseName: Optional[str]
    elementalAffinity: Optional[str] = None
    elementalWeakness: str
    hitPoints: int
    manaPoints: int
    attack: int
    defense: int
    picture: str
    description: str
    game: str

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



@router.get("/stored-monsters")
def read_monsters(db: Session = Depends(get_db)):
    return crud.get_monsters(db)

@router.get("/monsters/games", response_model=List[str])
def get_monster_games(db: Session = Depends(get_db)):
    monsters = crud.get_monsters(db)
    unique_games = {monster.game for monster in monsters if monster.game}
    return sort_zero_padded_numbers(list(unique_games)) 

@router.get("/monsters/", response_model=List[Monster])
def get_monsters(name: Optional[str] = None, game: Optional[str] = None, db: Session = Depends(get_db)):
    filters = {}
    if name:
        filters['name'] = name
    if game:
        filters['game'] = game

    monsters = crud.get_monsters(db, **filters)
    if not monsters:
        raise HTTPException(status_code=404, detail="Characters not found")
    else:
        # Sanitize response data
        sanitized_monsters = []
        for monster in monsters:
            if monster.elementalAffinity is None:
                monster.elementalAffinity = ""
            sanitized_monsters.append(monster)
        
        return sanitized_monsters