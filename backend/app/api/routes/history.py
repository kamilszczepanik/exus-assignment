import uuid
from typing import Any

from fastapi import APIRouter
from sqlmodel import desc, func, select

from app.api.deps import SessionDep
from app.models import WeatherHistory, WeatherHistorysPublic

router = APIRouter()


@router.get("/", response_model=WeatherHistorysPublic)
def get_weather_history(
    session: SessionDep, city_code: uuid.UUID | None = None, skip: int = 0, limit: int = 10
) -> Any:
    """
    Get weather history for the given city_code or return empty if no match.
    """

    if city_code is None:
        return WeatherHistorysPublic(data=[], count=0)

    count_statement = select(func.count()).select_from(WeatherHistory).where(WeatherHistory.city_code == city_code)
    count = session.exec(count_statement).one()

    if count == 0:
        return WeatherHistorysPublic(data=[], count=0)

    statement = (
        select(WeatherHistory)
        .where(WeatherHistory.city_code == city_code)
        .order_by(desc(WeatherHistory.date))  # Order by date descending
        .offset(skip)
        .limit(limit)
    )
    history = session.exec(statement).all()

    return WeatherHistorysPublic(data=history, count=count)
