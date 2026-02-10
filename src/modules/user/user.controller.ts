import { Elysia, t } from 'elysia';
import { User } from './user.model';
import { ZodError } from 'zod';

import { successResponse } from '../../utils/response';
import { HTTP_STATUS } from '../../constants';
import { createUserZodSchema, UserValidation } from './user.validation';
import { validate } from '@/utils/validate';

// Create user
export const userController = new Elysia({ prefix: '/users' })
  .post(
    '/',
    async ({ body, set }) => {
      // Validate body with Zod
      const result = await validate(createUserZodSchema, body);

      // Save to MongoDB
      const user = await User.create(result);

      set.status = HTTP_STATUS.CREATED;
      return successResponse('User created successfully', user);
    },
    {
      body: t.Record(t.String(), t.Any()),
    }
  )

  // Get user by ID
  .get('/:id', async ({ params }) => {
    // Validate params with Zod
    const validation = UserValidation.userParamsSchema.safeParse(params);

    if (!validation.success) {
      throw validation.error;
    }

    const { id } = validation.data;

    // This will throw CastError if ID format is invalid
    const user = await User.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    return successResponse('User fetched successfully', user);
  })

  // Update user
  .put(
    '/:id',
    async ({ params, body }: { params: Record<string, string>; body: any }) => {
      //params validation
      const paramsValidation =
        UserValidation.userParamsSchema.safeParse(params);

      if (!paramsValidation.success) {
        throw paramsValidation.error;
      }

      const { id } = paramsValidation.data;

      //   body validation
      const bodyValidation = UserValidation.updateUserZodSchema.safeParse(body);

      if (!bodyValidation.success) {
        throw bodyValidation.error;
      }

      const validatedData = bodyValidation.data;

      const user = await User.findByIdAndUpdate(id, validatedData, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        throw new Error('User not found');
      }

      return successResponse('User updated successfully', user);
    },
    {
      body: t.Record(t.String(), t.Any()),
    }
  )

  // Get all users
  .get('/', async () => {
    const users = await User.find().sort({ createdAt: -1 });
    return successResponse('Users fetched successfully', users);
  })

  // Delete user
  .delete('/:id', async ({ params }) => {
    const validation = UserValidation.userParamsSchema.safeParse(params);

    if (!validation.success) {
      throw validation.error;
    }

    const { id } = validation.data;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      throw new Error('User not found');
    }

    return successResponse('User deleted successfully', { id });
  });
