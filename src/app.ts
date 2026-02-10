import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { rateLimit } from 'elysia-rate-limit';
import { errorHandler } from './middlewares/errorHandler';
import { security } from './middlewares/security';
import { requestId } from './middlewares/requestId';
import { requestLogger } from './middlewares/requestLogger';
import { v1Router } from './routes/v1';

export const app = new Elysia()
  .use(requestId)
  .use(requestLogger)
  .use(security)
  .use(
    cors({
      origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : true,
      credentials: true,
    })
  )
  .use(
    rateLimit({
      duration: 60000,
      max: 100,
      errorResponse: new Response('Too many requests', { status: 429 }),
    })
  )
  .use(errorHandler)
  .use(v1Router)
  .get('/', () => {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>ElysiaJS API</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
          <div style="color: #2e7d32; font-size: 24px; font-weight: bold; text-align: center; background-color: #f0f8ff; padding: 30px; border-radius: 15px; margin: 20px; border: 3px solid #4caf50; box-shadow: 0 4px 20px rgba(76,175,80,0.3);"> 
            🚀 Welcome to ElysiaJS API v1.0.0 🚀
            <div style="font-size: 16px; color: #555; font-weight: normal; margin-top: 20px; line-height: 1.6;">
              This is a sample API built with ElysiaJS. Explore the endpoints and enjoy the blazing fast performance! 
              <br/><br/>
            </div>
          </div>
        </body>
        </html>
        `;

    return new Response(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  });
