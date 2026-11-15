const app = require('./app');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`[VELOOP Backend] Server listening on port ${PORT}`);
      console.log(`[VELOOP Backend] API ready at http://localhost:${PORT}/api`);
    });

    // Graceful shutdown handling
    const shutdown = () => {
      console.log('[VELOOP Backend] Shutting down gracefully...');
      server.close(() => {
        console.log('[VELOOP Backend] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('[VELOOP Backend] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
