from typing import Any

from fastapi import APIRouter
from sqlmodel import func, select

from app.api.deps import SessionDep
from app.models import WeatherHistory, WeatherHistorysPublic

router = APIRouter()


@router.get("/", response_model=WeatherHistorysPublic)
def get_weather_history(session: SessionDep, skip: int = 0, limit: int = 10) -> Any:
    """
    Get weather history.
    """

    # todo: weather history by the city
    count_statement = select(func.count()).select_from(WeatherHistory)
    count = session.exec(count_statement).one()
    statement = select(WeatherHistory).offset(skip).limit(limit)
    history = session.exec(statement).all()

    return WeatherHistorysPublic(data=history, count=count)
