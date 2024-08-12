from fastapi import APIRouter
import httpx

router = APIRouter()

@router.get("/monsters")
async def get_monsters():
    async with httpx.AsyncClient() as client:
        response = await client.get('https://www.moogleapi.com/api/v1/monsters')
        response.raise_for_status()
        return response.json()