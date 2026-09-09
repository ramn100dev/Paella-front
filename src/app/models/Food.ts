export interface Food {
    id: number
    name: string
    category: { id: number}
    sub_category: { id: number}
}

export type NewFood = Omit<Food, 'id'>;