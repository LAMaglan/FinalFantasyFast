import asyncio
from sqlalchemy.orm import Session
from database import SessionLocal, create_tables
import crud
import httpx

async def fetch_and_store_entities(db: Session, url: str, create_func):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url)
            response.raise_for_status()
            entities = response.json()
            for entity in entities:
                create_func(db, entity)
        except httpx.HTTPStatusError as e:
            print(f"Error fetching data from {url}: {e}")

async def initialize_db():
    db = SessionLocal()
    if not crud.get_characters(db) and not crud.get_monsters(db) and not crud.get_games(db):
        await fetch_and_store_entities(db, 'https://www.moogleapi.com/api/v1/characters', crud.create_character)
        await fetch_and_store_entities(db, 'https://www.moogleapi.com/api/v1/monsters', crud.create_monster)
        await fetch_and_store_entities(db, 'https://www.moogleapi.com/api/v1/games', crud.create_game)
    db.close()

if __name__ == "__main__":
    create_tables()  
    asyncio.run(initialize_db())