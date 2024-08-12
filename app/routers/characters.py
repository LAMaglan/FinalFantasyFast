from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import httpx
from ..database import get_db
from ..crud import create_character, get_characters

router = APIRouter()

@router.get("/characters")
async def fetch_and_store_characters(db: Session = Depends(get_db)):
    async with httpx.AsyncClient() as client:
        response = await client.get('https://www.moogleapi.com/api/v1/characters')
        response.raise_for_status()
        characters = response.json()
        for character in characters:
            if create_character(db, character) is None:
                return {"error": "Cannot insert or update character."}
        return characters

@router.get("/stored-characters")
def read_characters(db: Session = Depends(get_db)):
    return get_characters(db)