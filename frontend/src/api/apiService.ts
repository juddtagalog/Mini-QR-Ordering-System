import type {
    ApiResponse,
    CreateOrderPayload,
    Order,
    OrderStatus,
    Product,
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

export class ApiRequestError extends Error {
    status: number;
    errors: string[] | null;

    constructor(message: string, status: number, errors: string[] | null = null){
        super(message);
        this.name = 'ApiRequestError';
        this.status = status;
        this.errors = errors;
    }
}

async function request<T>(path: string, options: RequestInit={}): Promise<T>{
    let response: Response;

    try{
        response = await fetch(`${API_BASE_URL}${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
    } catch {
        throw new ApiRequestError('Could not reach the server.', 0);
    }

    const body = (await response.json()) as ApiResponse<T>;

    if (!body.success){
        throw new ApiRequestError(body.message, response.status,body.errors);
    }

    return body.data;
}

export function getProducts(): Promise<Product[]> {
    return request<Product[]>('/products');
}

export function getProduct(id: number): Promise<Product> {
    return request<Product>('/products/${id}');
}

export function getOrders(): Promise<Order[]> {
    return request<Order[]>('/orders');
}

export function getOrder(id: number): Promise<Order> {
    return request<Order>('/orders/${id}');
}

export function createOrder(payload: CreateOrderPayload): Promise<Order> {
    return request<Order>('/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export function updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
    return request<Order>('/orders/${id}/status', {
        method: 'PUT',
        body: JSON.stringify({status}),
    })
}