#!/bin/bash

poetry check
poetry export --format requirements.txt --output requirements.txt --without dev, tests
