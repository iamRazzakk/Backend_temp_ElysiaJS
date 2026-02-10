import { Elysia } from 'elysia';
import { logger } from '../utils/logger';

export const requestLogger = new Elysia()
  .derive(({ request }) => {
    const start = Date.now();
    const method = request.method;
    const url = request.url;

    // Show request in terminal
    console.log(`📝 ${method} ${new URL(url).pathname}`);

    // Log incoming request
    logger.info(`→ ${method} ${url}`, {
      method,
      url,
      timestamp: new Date().toISOString(),
    });

    return { start, method, url };
  })
  .onError(({ request, error, code, set }): any => {
    const method = request.method;
    const url = request.url;
    const status = set.status || 500;
    // @ts-ignore
    logger.error(`💥 ${method} ${url} ${status} - Error: ${error?.message}`, {
      method,
      url,
      // @ts-ignore
      error: error?.message,
      code,
      status,
      // @ts-ignore
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
      timestamp: new Date().toISOString(),
    });
  })
  .onAfterHandle(({ request, response, set }) => {
    const method = request.method;
    const url = request.url;
    const status = set.status || 200;
    // @ts-ignore
    const statusIcon = status >= 400 ? '❌' : status >= 300 ? '⚠️' : '✅';

    logger.info(`${statusIcon} ${method} ${url} ${status}`, {
      method,
      url,
      status,
      timestamp: new Date().toISOString(),
    });

    return response;
  });
