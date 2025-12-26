const port = process.env.PORT || '3001';

module.exports = {
  apps: [
    {
      name: 'QAYSAR-REACT',
      script: 'npx',
      args: ['--yes', 'serve', '-s', 'build', '-l', port],
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

