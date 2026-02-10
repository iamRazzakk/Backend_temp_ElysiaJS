import { Schema, model } from 'mongoose';
import { IProduct } from './product.interface';
import { PRODUCT_STATUS, PRODUCT_CATEGORY } from '../../enum/product.enum';

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      minlength: [2, 'Product name must be at least 2 characters long'],
      maxlength: [100, 'Product name cannot exceed 100 characters'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      minlength: [10, 'Description must be at least 10 characters long'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      enum: Object.values(PRODUCT_CATEGORY),
      required: [true, 'Category is required'],
    },
    status: {
      type: String,
      enum: Object.values(PRODUCT_STATUS),
      default: PRODUCT_STATUS.ACTIVE,
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      uppercase: true,
    },
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative'],
    },
    dimensions: {
      length: {
        type: Number,
        min: [0, 'Length cannot be negative'],
      },
      width: {
        type: Number,
        min: [0, 'Width cannot be negative'],
      },
      height: {
        type: Number,
        min: [0, 'Height cannot be negative'],
      },
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.length <= 10;
        },
        message: 'Cannot have more than 10 images',
      },
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Generate SKU automatically if not provided
productSchema.pre('save', async function (next) {
  if (!this.sku) {
    const count = await this.constructor.countDocuments();
    this.sku = `PRD-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

export const Product = model<IProduct>('Product', productSchema);
