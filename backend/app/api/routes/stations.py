from typing import Any

from fastapi import APIRouter
from sqlmodel import func, select

from app.api.deps import SessionDep
from app.models import MeteorologicalStation, MeteorologicalStationsPublic

router = APIRouter()


@router.get("/", response_model=MeteorologicalStationsPublic)
def get_stations(session: SessionDep) -> Any:
    """
    Get all meteorological stations available.
    """

    count_statement = select(func.count()).select_from(MeteorologicalStation)
    count = session.exec(count_statement).one()
    statement = select(MeteorologicalStation)
    stations = session.exec(statement).all()

    return MeteorologicalStationsPublic(data=stations, count=count)
