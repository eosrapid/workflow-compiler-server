#!/bin/bash
IMAGE_NAME="adappt"
VERSION="1.4.0"
IMAGE_FULL_NAME="eosrapid/${IMAGE_NAME}:${VERSION}"


docker rmi $IMAGE_FULL_NAME
docker build -t $IMAGE_FULL_NAME .
docker run --rm -p 3000:3000 $IMAGE_FULL_NAME
