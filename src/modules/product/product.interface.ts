import { Document } from 'mongoose';
import { PRODUCT_STATUS, PRODUCT_CATEGORY } from '../../enum/product.enum';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: PRODUCT_CATEGORY;
  status: PRODUCT_STATUS;
  stock: number;
  sku: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  images: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
