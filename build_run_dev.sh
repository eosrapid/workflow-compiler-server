#!/bin/bash
IMAGE_NAME="addapt"
CONTAINER_NAME="eosworkflowcon"
VERSION="1.2.2"
IMAGE_FULL_NAME="${IMAGE_NAME}:${VERSION}"


docker rm $CONTAINER_NAME
docker rmi $IMAGE_FULL_NAME
docker build -t $IMAGE_FULL_NAME .
docker run --name $CONTAINER_NAME -p 3000:3000 $IMAGE_FULL_NAME