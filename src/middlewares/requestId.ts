import { Elysia } from 'elysia';
import { randomUUID } from 'crypto';

export const requestId = new Elysia()
    .derive(({ request }) => {
        const requestId = request.headers.get('x-request-id') || randomUUID();
        return { requestId };
    })
    .onBeforeHandle(({ requestId, set }) => {
        set.headers['x-request-id'] = requestId;
    });
