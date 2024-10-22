import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import (
    Message,
    MeteorologicalStation,
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
    Create new forecast for a day in specific city.
    """
    city_exists = session.exec(
        select(MeteorologicalStation).where(
            MeteorologicalStation.code == forecast_in.city_code
        )
    ).first()

    if not city_exists:
        raise HTTPException(
            status_code=400, detail="City code not found in Meteorological Station"
        )

    forecast_exists = session.exec(
        select(WeatherForecast).where(
            WeatherForecast.city_code == forecast_in.city_code,
            func.date(WeatherForecast.date) == forecast_in.date.date(),
        )
    ).first()

    if forecast_exists:
        raise HTTPException(
            status_code=400,
            detail="Forecast for this city and day already exists. Instead of creating one, you can update it.",
        )

    forecast = WeatherForecast.model_validate(
        forecast_in, update={"user_id": current_user.id}
    )
    session.add(forecast)
    session.commit()
    session.refresh(forecast)
    return forecast


@router.put("/{id}", response_model=WeatherForecastPublic)
def update_forecast(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    forecast_in: WeatherForecastCreate,
) -> Any:
    """
    Update a forecast for a day in specific city.
    """
    city_exists = session.exec(
        select(MeteorologicalStation).where(
            MeteorologicalStation.code == forecast_in.city_code
        )
    ).first()

    if not city_exists:
        raise HTTPException(
            status_code=400, detail="City code not found in Meteorological Station"
        )

    forecast = session.get(WeatherForecast, id)
    if not forecast:
        raise HTTPException(
            status_code=404,
            detail="Forecast not found. Instead of updating, you can create a new one.",
        )
    if not current_user.is_superuser and (forecast.user_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    update_dict = forecast_in.model_dump(exclude_unset=True)
    forecast.sqlmodel_update(update_dict)
    session.add(forecast)
    session.commit()
    session.refresh(forecast)
    return forecast


@router.delete("/{id}")
def delete_forecast(
    session: SessionDep, current_user: CurrentUser, id: uuid.UUID
) -> Message:
    """
    Delete a weather forecast for a day in city.
    """
    forecast = session.get(WeatherForecast, id)
    if not forecast:
        raise HTTPException(status_code=404, detail="Forecast not found")
    if not current_user.is_superuser and (forecast.user_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(forecast)
    session.commit()
    return Message(message="Forecast deleted successfully")
