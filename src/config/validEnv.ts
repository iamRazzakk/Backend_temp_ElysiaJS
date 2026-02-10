import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const validEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value || defaultValue!;
};

export const envConfig = {
  IP: validEnv('IP'),
  appName: validEnv('APP_NAME', 'Easy Express'),
  nodeEnv: validEnv('NODE_ENV', 'development'),
  port: parseInt(validEnv('PORT', '8000')),

  // Database
  database: {
    host: validEnv('DB_HOST', 'localhost'),
    port: parseInt(validEnv('DB_PORT', '27017')),
    DB_NAME: validEnv('DB_NAME', 'elysia'),
  },

  // JWT
  jwt: {
    secret: validEnv('JWT_SECRET', 'secret'),
    expiresIn: validEnv('JWT_EXPIRES_IN', '7d'),
    cookieExpiresIn: parseInt(validEnv('JWT_COOKIE_EXPIRES_IN', '7')),
    cookieName: validEnv('JWT_COOKIE_NAME', 'jwt'),
    cookieSecure: validEnv('JWT_COOKIE_SECURE', 'false') === 'true',
    cookieHttpOnly: validEnv('JWT_COOKIE_HTTP_ONLY', 'true') === 'true',
    cookieSameSite: validEnv('JWT_COOKIE_SAME_SITE', 'strict'),
    bcryptSalt: parseInt(validEnv('JWT_BYCRYPT_SALT', '14')),
  },

  // Mail
  mail: {
    host: validEnv('MAIL_HOST', 'smtp.gmail.com'),
    port: parseInt(validEnv('MAIL_PORT', '2525')),
    user: validEnv('MAIL_USER', ''),
    password: validEnv('MAIL_PASSWORD', ''),
  },

  // Redis
  //   redis: {
  //     host: validEnv("REDIS_HOST", "localhost"),
  //     port: parseInt(validEnv("REDIS_PORT", "6379")),
  //     password: validEnv("REDIS_PASSWORD", ""),
  //     uri: validEnv("REDIS_URI", "redis://localhost:6379"),
  //   },
};
