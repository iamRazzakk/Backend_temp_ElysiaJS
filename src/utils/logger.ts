import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

const { combine, timestamp, label, printf, colorize } = format;

// Custom Log Format
const myFormat = printf(({ level, message, label, timestamp }) => {
    const date = new Date(timestamp as string);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${date.toDateString()} ${hour}:${minutes}:${seconds} [${label}] ${level}: ${message}`;
});

// Define log directory
const logDir = 'logs';

const logger = createLogger({
    level: 'info',
    format: combine(
        label({ label: 'App' }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        myFormat
    ),
    transports: [
        // Console transport with colors
        new transports.Console({
            format: combine(
                colorize(),
                printf(({ level, message, label, timestamp }) => {
                    return `${timestamp} [${label}] ${level}: ${message}`;
                })
            ),
        }),
        // Success/Info logs (rotated daily)
        new DailyRotateFile({
            filename: path.join(logDir, 'success', '%DATE%-success.log'),
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'info',
        }),
        // Error logs (rotated daily)
        new DailyRotateFile({
            filename: path.join(logDir, 'error', '%DATE%-error.log'),
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'error',
        }),
    ],
});

export { logger };