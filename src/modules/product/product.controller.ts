import { Elysia, t } from 'elysia';
import { Product } from './product.model';
import { ProductValidation } from './product.validation';
import { successResponse } from '../../utils/response';
import { HTTP_STATUS } from '../../constants';

export const productController = new Elysia({ prefix: '/products' })
  // Create product
  .post(
    '/',
    async ({ body, set }) => {
      // Validate body with Zod
      const validatedData = ProductValidation.createProductZodSchema.parse({
        body,
      });

      // Save to MongoDB
      const product = await Product.create(validatedData.body);

      set.status = HTTP_STATUS.CREATED;
      return successResponse('Product created successfully', product);
    },
    {
      body: t.Object({
        name: t.String(),
        description: t.String(),
        price: t.Number(),
        category: t.String(),
        status: t.Optional(t.String()),
        stock: t.Optional(t.Number()),
        sku: t.Optional(t.String()),
        weight: t.Optional(t.Number()),
        dimensions: t.Optional(
          t.Object({
            length: t.Number(),
            width: t.Number(),
            height: t.Number(),
          })
        ),
        images: t.Optional(t.Array(t.String())),
        tags: t.Optional(t.Array(t.String())),
      }),
    }
  )

  // Get all products
  .get('/', async ({ query }) => {
    const { page = 1, limit = 10, category, status, search } = query as any;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    const result = {
      products,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: total,
        limit: parseInt(limit),
      },
    };

    return successResponse('Products fetched successfully', result);
  })

  // Get product by ID
  .get('/:id', async ({ params }) => {
    // Validate params with Zod
    const { id } = ProductValidation.productParamsSchema.parse(params);

    const product = await Product.findById(id);

    if (!product) {
      throw new Error('Product not found');
    }

    return successResponse('Product fetched successfully', product);
  })

  // Update product
  .put('/:id', async ({ params, body }) => {
    // Validate params and body with Zod
    const { id } = ProductValidation.productParamsSchema.parse(params);
    const validatedData = ProductValidation.updateProductZodSchema.parse({
      body,
    });

    const product = await Product.findByIdAndUpdate(id, validatedData.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return successResponse('Product updated successfully', product);
  })

  // Delete product
  .delete('/:id', async ({ params }) => {
    const { id } = ProductValidation.productParamsSchema.parse(params);

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      throw new Error('Product not found');
    }

    return successResponse('Product deleted successfully', { id });
  })

  // Get products by category
  .get('/category/:category', async ({ params, query }) => {
    const { page = 1, limit = 10 } = query as any;
    const { category } = params;
    const skip = (page - 1) * limit;

    const products = await Product.find({ category })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments({ category });

    const result = {
      products,
      category,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: total,
        limit: parseInt(limit),
      },
    };

    return successResponse(
      `Products in ${category} category fetched successfully`,
      result
    );
  });
