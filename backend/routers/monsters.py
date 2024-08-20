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

@router.get("/stored-monsters")
def read_monsters(db: Session = Depends(get_db)):
    return crud.get_monsters(db)


@router.get("/monsters/", response_model=List[Monster])
def get_monsters_by_name(name: str, db: Session = Depends(get_db)):
    monsters = crud.get_monsters_by_name(db, name)
    if not monsters:
        raise HTTPException(status_code=404, detail="Monsters not found")
    
    # Sanitize response data
    sanitized_monsters = []
    for monster in monsters:
        if monster.elementalAffinity is None:
            monster.elementalAffinity = ""
        sanitized_monsters.append(monster)
    
    return sanitized_monsters