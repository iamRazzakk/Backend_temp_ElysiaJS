import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { rateLimit } from "elysia-rate-limit";
import { errorHandler } from "./middlewares/errorHandler";
import { security } from "./middlewares/security";
import { requestId } from "./middlewares/requestId";

export const app = new Elysia()
  .use(requestId)
  .use(security)
  .use(
    cors({
      origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",")
        : true,
      credentials: true,
    }),
  )
  .use(
    rateLimit({
      duration: 60000,
      max: 100,
      errorResponse: new Response("Too many requests", { status: 429 }),
    }),
  )
  .use(errorHandler)
  .get("/", () => {
    return `
        <div style="color: red; font-size: 20px; font-weight: bold; text-align: center; background-color: #f0f0f0; padding: 20px; border-radius: 10px; margin: 20px; border: 2px solid red; box-shadow: 0 0 10px red inset;"> Welcome to ElysiaJS version 1.0.0 </div>
        `;
  });
