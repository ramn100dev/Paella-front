import { Food } from './Food';

export interface SubCategory {
    id: number;
    name: string;
    category?: { id: number}
    foods?: Food[];
}

export type NewSubCategory = Omit<SubCategory, 'id'>;