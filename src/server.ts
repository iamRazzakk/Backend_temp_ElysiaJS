import { app } from './app';
import { connectDatabase } from './config/database';
import { ERROR_MESSAGES, HTTP_STATUS } from './constants';
import { errorResponse } from './utils/response';
import { logger } from './utils/logger';
import mongoose from 'mongoose';

// Handle Uncaught Exceptions
process.on('uncaughtException', error => {
  logger.error('❌ Uncaught Exception Detected', { err: error });
  process.exit(1);
});

let server: any;

const main = async () => {
  try {
    await connectDatabase();
    logger.info('✅ MongoDB connected successfully');

    const port = process.env.PORT || 3000;
    server = app.listen(port);

    logger.info(`🚀 Server is running on port ${port}`);
  } catch (error) {
    logger.error('❌ Error', { err: error });
    process.exit(1);
  }
};

// Handle Unhandled Rejections
process.on('unhandledRejection', error => {
  logger.error('❌ Unhandled Rejection Detected', { err: error });
  process.exit(1);
});

app.use((app): any => {
  app.all('*', () => {
    return {
      status: HTTP_STATUS.NOT_FOUND,
      body: errorResponse(ERROR_MESSAGES.API_NOT_FOUND),
    };
  });
});

main();

// Graceful Shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received, starting graceful shutdown...`);

  try {
    if (server) {
      await server.stop(); // Elysia specific stop
      logger.info('✅ HTTP server closed');
    }

    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      logger.info('✅ Database connection closed');
    }

    logger.info('✅ Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error during shutdown', { err: error });
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
