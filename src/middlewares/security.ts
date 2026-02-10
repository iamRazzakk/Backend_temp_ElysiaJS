import { Elysia } from 'elysia';

export const security = new Elysia().onBeforeHandle(({ set }) => {
  set.headers['X-Content-Type-Options'] = 'nosniff';
  set.headers['X-Frame-Options'] = 'DENY';
  set.headers['X-XSS-Protection'] = '1; mode=block';
  set.headers['Strict-Transport-Security'] =
    'max-age=31536000; includeSubDomains';
  set.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
});
