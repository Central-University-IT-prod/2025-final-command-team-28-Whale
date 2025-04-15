#!/bin/bash

cp $(pwd)/.infra/local-docker-compose.yml docker-compose.yml

podman compose up -d

