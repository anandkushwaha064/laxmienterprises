FROM python:3.11.0


LABEL AUTHOR="ANAND Org"

RUN apt-get update && apt-get install -y --no-install-recommends \
    rsyslog \
    jq \
    nano \
    vim \
    cron \
    curl \
    telnet

WORKDIR /backend

RUN pip install -U pip

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

RUN pip install python-slugify

COPY . .

# Expose port 80
EXPOSE 8000
# Start Nginx server
ENTRYPOINT ["start.sh"]


# docker build . -t laxmi/backend  --no-cache  