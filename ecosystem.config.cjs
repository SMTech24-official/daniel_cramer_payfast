// for nextjs project

module.exports = {
  apps: [
    {
      name: "daniel_cramer_payfast",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      autorestart: true,
      max_restarts: 20,
      restart_delay: 5000, // 5 seconds delay
      watch: false,
    },
  ],
};
