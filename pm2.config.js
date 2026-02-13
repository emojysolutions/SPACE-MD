module.exports = {
  apps: [{
    name: 'queen-angela-md',
    script: 'start.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/error.log',
    out_file: './logs/output.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    restart_delay: 5000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
