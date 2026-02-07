import { z } from 'zod';

const envSchema = z.object({
    PORT: z.string().default('3000'),
    MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    ALLOWED_ORIGINS: z.string().optional(),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

export const validateEnv = () => {
    try {
        const env = envSchema.parse(process.env);
        return env;
    } catch (error) {
        console.error('❌ Environment validation failed:', error);
        process.exit(1);
    }
};

export type Env = z.infer<typeof envSchema>;
