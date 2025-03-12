from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from sqlmodel import Session

from app.core.db import engine
from app.models import SensorData

router = APIRouter()

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
   <body>
        <h1>Live Sensor Data for <span id="city_name"></span></h1>
        <ul id='sensor-data-list'></ul>
        <script>
            var city_code = 'af4c20c1-beb5-430e-8644-a0a8e7e46d45';
            document.querySelector("#city_name").textContent = city_code;
            var ws = new WebSocket(`ws://localhost:8000/api/v1/ws/ws/sensor/${city_code}`);

            ws.onmessage = function(event) {
                var sensorData = JSON.parse(event.data);
                var list = document.getElementById('sensor-data-list');
                var item = document.createElement('li');
                item.textContent = `${sensorData.category}: ${sensorData.measurement} ${sensorData.unit} - ${new Date(sensorData.date).toLocaleString()}`;
                list.appendChild(item);
            };
        </script>
    </body>
</html>
"""


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, data: dict):
        for connection in self.active_connections:
            await connection.send_json(data)


manager = ConnectionManager()


@router.get("/")
def get():
    return HTMLResponse(html)


@router.websocket("/ws/sensor/{city_code}")
async def websocket_endpoint(websocket: WebSocket, city_code: str):
    await manager.connect(websocket)
    try:
        while True:
            sensor_data = await websocket.receive_json()

            for info in sensor_data["info"]:
                with Session(engine) as session:
                    sensor_record = SensorData(
                        identifier=sensor_data["identifier"],
                        sensor=sensor_data["sensor"],
                        city=sensor_data["city"],
                        date=sensor_data["date"],
                        category=info["category"],
                        measurement=info["measurement"],
                        unit=info["unit"],
                    )
                    session.add(sensor_record)
                    session.commit()

            await manager.broadcast(
                {
                    "city": sensor_data["city"],
                    "category": sensor_data["info"][0]["category"],
                    "measurement": sensor_data["info"][0]["measurement"],
                    "unit": sensor_data["info"][0]["unit"],
                    "date": sensor_data["date"],
                }
            )
    except WebSocketDisconnect:
        manager.disconnect(websocket)
