#!/bin/bash

# Get port from environment variable or use default 3001
PORT=${PORT:-3001}

# Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# Check if build directory exists
if [ ! -d "build" ]; then
  echo "Error: build directory not found!"
  exit 1
fi

# Try to use serve (global or npx)
if command -v serve &> /dev/null; then
  exec serve -s build -l $PORT
elif command -v npx &> /dev/null; then
  exec npx --yes serve -s build -l $PORT
else
  echo "Error: neither serve nor npx found!"
  exit 1
fi

