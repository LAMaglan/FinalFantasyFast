from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import httpx
from ..database import get_db
from ..crud import create_monster, get_monsters

router = APIRouter()

@router.get("/monsters")
async def fetch_and_store_monsters(db: Session = Depends(get_db)):
    async with httpx.AsyncClient() as client:
        response = await client.get('https://www.moogleapi.com/api/v1/monsters')
        response.raise_for_status()
        monsters = response.json()
        for monster in monsters:
            if create_monster(db, monster) is None:
                return {"error": "Cannot insert or update monster."}
        return monsters

@router.get("/stored-monsters")
def read_monsters(db: Session = Depends(get_db)):
    return get_monsters(db)