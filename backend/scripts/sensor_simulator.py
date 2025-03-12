import asyncio
import random
import uuid
from datetime import datetime

from sqlmodel import Session

from app.api.routes.websockets import broadcast_new_data
from app.core.db import engine
from app.models import SensorData


def generate_mock_data():
    sensors = [
        {"sensor": "HUM-001", "category": "Humidity", "unit": "Percentage"},
        {"sensor": "TEM-456", "category": "Temperature", "unit": "Celsius"},
        {"sensor": "WND-245", "category": "Wind", "unit": "m/s"},
    ]
    city = "London"

    for sensor_info in sensors:
        yield {
            "identifier": str(uuid.uuid4()),
            "sensor": sensor_info["sensor"],
            "city": city,
            "category": sensor_info["category"],
            "measurement": random.uniform(10, 100),
            "unit": sensor_info["unit"],
            "date": datetime.utcnow(),
        }


def save_data_to_db():
    with Session(engine) as session:
        for data in generate_mock_data():
            sensor_data = SensorData(**data)
            session.add(sensor_data)
            session.commit()
            asyncio.run(broadcast_new_data(sensor_data))


if __name__ == "__main__":
    while True:
        save_data_to_db()
