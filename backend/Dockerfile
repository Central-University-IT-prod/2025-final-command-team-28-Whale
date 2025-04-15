FROM python:3.12

COPY ./requirements.txt /

RUN --mount=type=cache,target=/root/.cache \
        pip install -r requirements.txt

COPY . /app
WORKDIR /app

CMD ["sh", "-c", "alembic upgrade head && uvicorn main:app --host $SERVER_HOST --port $SERVER_PORT --workers 4"]
