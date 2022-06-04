#!/bin/bash
docker build -t logicsim .
docker run --name logicsim_container --rm -it -d -p 8080:8080 logicsim