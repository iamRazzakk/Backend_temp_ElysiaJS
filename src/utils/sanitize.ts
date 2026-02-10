import validator from 'validator';

export const sanitizeString = (input: string): string => {
  return validator.escape(validator.trim(input));
};

export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
  const sanitized = {} as T;

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeString(value) as T[keyof T];
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key as keyof T] = sanitizeObject(value);
    } else {
      sanitized[key as keyof T] = value;
    }
  }

  return sanitized;
};
