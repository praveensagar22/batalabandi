import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

const startServer = async () => {
  // Connect to Database
  await connectDB();

  const server = app.listen(env.PORT, '0.0.0.0', () => {
    console.log(`⚡ [server]: Server running in ${env.NODE_ENV} mode on port http://0.0.0.0:${env.PORT}`);
  });

  // Graceful Unhandled Rejection & Sigterm Handling
  process.on('unhandledRejection', (err: Error) => {
    console.error('❌ UNHANDLED REJECTION! Shutting down...', err);
    server.close(() => {
      process.exit(1);
    });
  });

  process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully...');
    server.close(() => {
      console.log('💥 Process terminated!');
    });
  });
};

startServer();
