import { SubCategory } from './SubCategory';

export interface Category {
    id: number;
    name: string;
    subCategories?: SubCategory[];
}