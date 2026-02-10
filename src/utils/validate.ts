import { ZodError, type ZodTypeAny } from 'zod';

export const formatZodError = (err: ZodError) => {
  return err.issues.map(i => ({
    path: i.path.join('.'),
    message: i.message,
  }));
};

export const validate = async <T extends ZodTypeAny>(
  schema: T,
  data: unknown
) => {
  const parsed = await schema.safeParseAsync(data);
  if (!parsed.success) {
    const formatted = parsed.error.issues.map(i => ({
      field: i.path.join('.'),
      message: i.message,
    }));

    throw new Error(JSON.stringify(formatted));
  }

  return parsed.data;
};
