import uuid
from datetime import datetime

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    forecast: list["WeatherForecast"] = Relationship(
        back_populates="user", cascade_delete=True
    )


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


class MeteorologicalStationBase(SQLModel):
    name: str = Field(min_length=1, max_length=255)
    latitude: float
    longitude: float
    date_of_installation: datetime


class MeteorologicalStation(MeteorologicalStationBase, table=True):
    code: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    forecast: list["WeatherForecast"] = Relationship(
        back_populates="city", cascade_delete=True
    )
    history: list["WeatherHistory"] = Relationship(
        back_populates="city", cascade_delete=True
    )


class MeteorologicalStationPublic(MeteorologicalStationBase):
    code: uuid.UUID


class MeteorologicalStationsPublic(SQLModel):
    data: list[MeteorologicalStationPublic]
    count: int


class WeatherForecastBase(SQLModel):
    date: datetime
    high_temperature: int
    low_temperature: int
    wind: str
    humidity: int = Field(ge=0, le=100)


class WeatherForecast(WeatherForecastBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    user: User | None = Relationship(back_populates="forecast")
    city_code: uuid.UUID = Field(
        foreign_key="meteorologicalstation.code", nullable=False, ondelete="CASCADE"
    )
    city: MeteorologicalStation | None = Relationship(back_populates="forecast")


class WeatherForecastPublic(WeatherForecastBase):
    id: uuid.UUID
    city: MeteorologicalStation
    user: User | None


class WeatherForecastsPublic(SQLModel):
    data: list[WeatherForecastPublic]
    count: int


class WeatherForecastCreate(WeatherForecastBase):
    city_code: uuid.UUID


class WeatherForecastUpdate(WeatherForecastBase):
    id: uuid.UUID
    city_code: uuid.UUID


class WeatherHistoryBase(SQLModel):
    date: datetime
    temperature: int
    wind: str
    humidity: int = Field(ge=0, le=100)


class WeatherHistory(WeatherHistoryBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    city_code: uuid.UUID = Field(
        foreign_key="meteorologicalstation.code", nullable=False, ondelete="CASCADE"
    )
    city: MeteorologicalStation | None = Relationship(back_populates="history")


class WeatherHistoryPublic(WeatherHistoryBase):
    id: uuid.UUID
    city: MeteorologicalStation


class WeatherHistorysPublic(SQLModel):
    data: list[WeatherHistoryPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)


class SensorData(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    identifier: str
    sensor: str
    city: str
    category: str
    measurement: float
    unit: str
    date: datetime
