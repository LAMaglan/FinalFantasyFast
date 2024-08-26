import asyncio
from sqlalchemy.orm import Session
from database import SessionLocal, create_tables
import crud
import httpx

async def fetch_and_store_characters(db: Session):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get('https://www.moogleapi.com/api/v1/characters')
            response.raise_for_status()
            characters = response.json()
            for character in characters:
                crud.create_character(db, character)
        except httpx.HTTPStatusError as e:
            print(f"Error fetching characters: {e}")

async def fetch_and_store_monsters(db: Session):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get('https://www.moogleapi.com/api/v1/monsters')
            response.raise_for_status()
            monsters = response.json()
            for monster in monsters:
                crud.create_monster(db, monster)
        except httpx.HTTPStatusError as e:
            print(f"Error fetching monsters: {e}")

async def fetch_and_store_games(db: Session):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get('https://www.moogleapi.com/api/v1/games')
            response.raise_for_status()
            games = response.json()
            for game in games:
                crud.create_game(db, game)
        except httpx.HTTPStatusError as e:
            print(f"Error fetching games: {e}")

async def initialize_db():
    db = SessionLocal()
    # Check if the database needs seeding
    if not crud.get_characters(db) and not crud.get_monsters(db) and not crud.get_games(db):
        await fetch_and_store_characters(db)
        await fetch_and_store_monsters(db)
        await fetch_and_store_games(db)
    db.close()

if __name__ == "__main__":
    create_tables()  
    asyncio.run(initialize_db())