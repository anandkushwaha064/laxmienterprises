FROM python:3.11.0

RUN apt update

WORKDIR /backend

RUN pip install -U pip

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt