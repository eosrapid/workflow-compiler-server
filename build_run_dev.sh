#!/bin/bash
IMAGE_NAME="eosworkflow"
CONTAINER_NAME="eosworkflowcon"
VERSION="1.1.6"
IMAGE_FULL_NAME="${IMAGE_NAME}:${VERSION}"


docker rm $CONTAINER_NAME
docker rmi $IMAGE_FULL_NAME
docker build -t $IMAGE_FULL_NAME .
#docker run --name $CONTAINER_NAME -p 3000:3000 -it $IMAGE_FULL_NAME /bin/bash
docker run --name $CONTAINER_NAME -p 3000:3000 $IMAGE_FULL_NAME