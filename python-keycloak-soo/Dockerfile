FROM python:3.10.14-slim-bullseye

WORKDIR /api

COPY requirements.txt /api/

RUN python -m pip install --upgrade pip

RUN pip install -r requirements.txt

COPY . /api

EXPOSE 8080

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8080"]
