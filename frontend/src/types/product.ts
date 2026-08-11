export type ProductCategory =
| 'Appetizer'
| 'Entree'
| 'Dessert'
| 'Beverage'
| 'Sides'
| 'Specials'
| 'Salads';

export interface Product {
    id: number,
    name: string,
    description: string,
    price: number,
    category: ProductCategory,
    image_url: string | null,
    is_available: boolean,
    created_at: string;


}