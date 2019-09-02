#!/bin/bash
IMAGE_NAME="adappt"
CONTAINER_NAME="eosworkflowcon"
VERSION="1.2.5"
IMAGE_FULL_NAME="${IMAGE_NAME}:${VERSION}"


docker rmi $IMAGE_FULL_NAME
docker build -t $IMAGE_FULL_NAME .
docker run --rm -p 3000:3000 $IMAGE_FULL_NAME