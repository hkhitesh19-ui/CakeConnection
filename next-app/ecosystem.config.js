module.exports = {
  apps: [
    {
      name: "cakeconnection",
      script: "npm",
      args: "start -- -p 3001",
      env: {
        NODE_ENV: "production",
        PORT: 3001
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G"
    }
  ]
};
