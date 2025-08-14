import { config } from 'dotenv';

import app from './app';
import { connectDB } from './config/db';

config();

const PORT = process.env.PORT || 8000;

async function startServer() {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // Graceful shutdown
  const shutdown = (signal: string) => {
    console.log(`${signal} received. Shutting down...`);
    server.close(() => {
      // Close DB connections
      import('mongoose').then(({ default: mongoose }) => {
        mongoose.connection.close(false).then(() => {
          process.exit(0);
        });
      });
    });
    // Force exit if not closed in time
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer();