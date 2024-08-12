from fastapi import APIRouter
import httpx

router = APIRouter()

@router.get("/characters")
async def get_characters():
    async with httpx.AsyncClient() as client:
        response = await client.get('https://www.moogleapi.com/api/v1/characters')
        response.raise_for_status()
        return response.json()