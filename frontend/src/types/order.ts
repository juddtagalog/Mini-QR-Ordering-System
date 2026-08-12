export interface OrderItem {
    product_id: number,
    name: string | null,
    quantity: number,
    price: number;

}
export type OrderStatus =| 'Pending'| 'Paid'| 'Failed';

export interface Order {
    id: number,
    customer_name: string | null,
    table_number: string | null,
    items: OrderItem[],
    total_amount: number,
    status: OrderStatus,
    created_at: string,
    updated_at: string;

}

export interface CreateOrderItemPayload {
    product_id: number,
    name?: string,
    quantity: number,
    price: number,
}

export interface CreateOrderPayload {
    table_number: string | null,
    customer_name?: string,
    items: CreateOrderItemPayload[],
}