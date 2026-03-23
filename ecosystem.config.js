const path = require('path');
const port = process.env.PORT || '3019';

module.exports = {
  apps: [
    {
      name: 'QAYSAR-REACT',
      script: path.join(__dirname, 'start-server.sh'),
      interpreter: 'bash',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: port
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    }
  ]
};

