#!/bin/bash

cd "$(dirname "$0")"
NAME=${1-bob}
/opt/google/chrome/chrome \
    --user-data-dir=../data/chrome-$NAME \
    #--disable-web-security
