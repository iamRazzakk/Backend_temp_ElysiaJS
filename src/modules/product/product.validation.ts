import { z } from 'zod';
import { PRODUCT_STATUS, PRODUCT_CATEGORY } from '../../enum/product.enum';

const createProductZodSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, { message: 'Product name must be at least 2 characters long' })
      .max(100, { message: 'Product name is too long' })
      .trim()
      .nonempty({ message: 'Product name is required' }),

    description: z
      .string()
      .min(10, { message: 'Description must be at least 10 characters long' })
      .max(1000, { message: 'Description is too long' })
      .trim()
      .nonempty({ message: 'Description is required' }),

    price: z
      .number()
      .min(0, { message: 'Price cannot be negative' })
      .positive({ message: 'Price must be positive' }),

    category: z.nativeEnum(PRODUCT_CATEGORY, {
      errorMap: () => ({ message: 'Invalid category' }),
    }),

    status: z
      .nativeEnum(PRODUCT_STATUS)
      .default(PRODUCT_STATUS.ACTIVE)
      .optional(),

    stock: z
      .number()
      .int({ message: 'Stock must be an integer' })
      .min(0, { message: 'Stock cannot be negative' })
      .default(0)
      .optional(),

    sku: z.string().optional(), // Will be auto-generated if not provided

    weight: z
      .number()
      .min(0, { message: 'Weight cannot be negative' })
      .optional(),

    dimensions: z
      .object({
        length: z.number().min(0, { message: 'Length cannot be negative' }),
        width: z.number().min(0, { message: 'Width cannot be negative' }),
        height: z.number().min(0, { message: 'Height cannot be negative' }),
      })
      .optional(),

    images: z
      .array(z.string().url({ message: 'Invalid image URL' }))
      .max(10, { message: 'Cannot have more than 10 images' })
      .default([])
      .optional(),

    tags: z.array(z.string().trim().min(1)).default([]).optional(),
  }),
});

const updateProductZodSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).trim().optional(),
    description: z.string().min(10).max(1000).trim().optional(),
    price: z.number().min(0).optional(),
    category: z.nativeEnum(PRODUCT_CATEGORY).optional(),
    status: z.nativeEnum(PRODUCT_STATUS).optional(),
    stock: z.number().int().min(0).optional(),
    sku: z.string().optional(),
    weight: z.number().min(0).optional(),
    dimensions: z
      .object({
        length: z.number().min(0),
        width: z.number().min(0),
        height: z.number().min(0),
      })
      .optional(),
    images: z.array(z.string().url()).max(10).optional(),
    tags: z.array(z.string().trim().min(1)).optional(),
  }),
});

const productParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, {
    message: 'Invalid product ID format',
  }),
});

export const ProductValidation = {
  createProductZodSchema,
  updateProductZodSchema,
  productParamsSchema,
};
