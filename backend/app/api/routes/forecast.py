import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import (
    WeatherForecast,
    WeatherForecastCreate,
    WeatherForecastPublic,
    WeatherForecastsPublic,
)

router = APIRouter()


@router.get("/", response_model=WeatherForecastsPublic)
def get_weather_forecast(
    session: SessionDep,
    current_user: CurrentUser,
    city_code: uuid.UUID | None = None,
    skip: int = 0,
    limit: int = 7,
) -> Any:
    """
    Get weather forecast for next days in specific city.
    """

    if city_code is None:
        return WeatherForecastsPublic(data=[], count=0)

    if current_user.is_superuser:
        count_statement = select(func.count()).select_from(WeatherForecast)
        count = session.exec(count_statement).one()
        statement = select(WeatherForecast).offset(skip).limit(limit)
        forecasts = session.exec(statement).all()
    else:
        count_statement = (
            select(func.count())
            .select_from(WeatherForecast)
            .where(
                WeatherForecast.user_id == current_user.id,
                WeatherForecast.city_code == city_code,
            )
        )
        count = session.exec(count_statement).one()
        statement = (
            select(WeatherForecast)
            .where(
                WeatherForecast.user_id == current_user.id,
                WeatherForecast.city_code == city_code,
            )
            .offset(skip)
            .limit(limit)
        )
        forecasts = session.exec(statement).all()

    return WeatherForecastsPublic(data=forecasts, count=count)


@router.get("/{id}", response_model=WeatherForecastPublic)
def read_forecast(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    """
    Get daily weather forecast by ID.
    """
    forecast = session.get(WeatherForecast, id)
    if not forecast:
        raise HTTPException(status_code=404, detail="Item not found")
    if not current_user.is_superuser and (forecast.user_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return forecast


@router.post("/", response_model=WeatherForecastPublic)
def create_forecast(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    forecast_in: WeatherForecastCreate,
) -> Any:
    """
    Create new forecast for a day.
    """
    # todo: check if forecast for this day for this city already exists
    forecast = WeatherForecast.model_validate(
        forecast_in, update={"user_id": current_user.id}
    )
    session.add(forecast)
    session.commit()
    session.refresh(forecast)
    return forecast


# @router.put("/{id}", response_model=WeatherForecastPublic)
# def update_item(
#     *,
#     session: SessionDep,
#     current_user: CurrentUser,
#     id: uuid.UUID,
#     item_in: ItemUpdate,
# ) -> Any:
#     """
#     Update an item.
#     """
#     item = session.get(Item, id)
#     if not item:
#         raise HTTPException(status_code=404, detail="Item not found")
#     if not current_user.is_superuser and (item.owner_id != current_user.id):
#         raise HTTPException(status_code=400, detail="Not enough permissions")
#     update_dict = item_in.model_dump(exclude_unset=True)
#     item.sqlmodel_update(update_dict)
#     session.add(item)
#     session.commit()
#     session.refresh(item)
#     return item


# @router.delete("/{id}")
# def delete_item(
#     session: SessionDep, current_user: CurrentUser, id: uuid.UUID
# ) -> Message:
#     """
#     Delete an item.
#     """
#     item = session.get(Item, id)
#     if not item:
#         raise HTTPException(status_code=404, detail="Item not found")
#     if not current_user.is_superuser and (item.owner_id != current_user.id):
#         raise HTTPException(status_code=400, detail="Not enough permissions")
#     session.delete(item)
#     session.commit()
#     return Message(message="Item deleted successfully")
