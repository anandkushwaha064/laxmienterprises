docker save -o laxmi-front.tar laxmi/front

docker save -o laxmi-backend.tar laxmi/backend

docker load -i laxmi-backend.tar
docker load -i laxmi-front.tar
