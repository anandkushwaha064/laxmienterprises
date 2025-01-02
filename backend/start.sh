#!/bin/bash

# sleep 10
# Run Django migrations

pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate

python manage.py collectstatic --noinput

# if this is the first time initializing co.meta
# import basic data
if [ ! -f "/backend/inits/.initiated" ]; then
    python manage.py loaddata user.json
    find defaults -name "*.json" | sort | xargs -I{} python manage.py loaddata {} && touch /backend/inits/.initiated
fi


python manage.py runserver 0.0.0.0:8000