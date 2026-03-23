#!/bin/bash

# PRODUCTION
git reset --hard
git checkout master
git pull origin master

npm i yarn -g
yarn global add serve
yarn
yarn run build

# Stop existing process if running
pm2 stop QAYSAR-REACT 2>/dev/null || true
pm2 delete QAYSAR-REACT 2>/dev/null || true

# Set port (default 3019 to avoid conflicts with other projects)
PORT=${PORT:-3019}

# Make start-server.sh executable
chmod +x start-server.sh 2>/dev/null || true

# Start using ecosystem config or direct command
if [ -f ecosystem.config.js ]; then
  PORT=$PORT pm2 start ecosystem.config.js
else
  pm2 start npx --name QAYSAR-REACT -- serve -s build -l $PORT
fi

pm2 save