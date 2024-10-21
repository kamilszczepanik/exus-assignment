from fastapi import APIRouter

from app.api.routes import forecast, history, items, login, stations, users, utils

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(items.router, prefix="/items", tags=["items"])
api_router.include_router(forecast.router, prefix="/forecast", tags=["forecast"])
api_router.include_router(stations.router, prefix="/stations", tags=["stations"])
api_router.include_router(history.router, prefix="/history", tags=["history"])
