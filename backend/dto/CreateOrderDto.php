<?php

class CreateOrderDto
{
    public static function validate(array $input): array
    {
        $errors = [];
        //table number string dapat if naa pero optional ra kay di man deploy to actual restaurant
        if (isset($input['table_number']) && !is_string($input['table_number'])) {
            $errors[] = 'table_number must be a string if provided.';
        }

        if (isset($input['customer_name']) && !is_string($input['customer_name'])){
            $errors[] = 'customer_name must be a string if provided.';
        }

        if(empty($input['items']) || !is_array($input['items'])){
            $errors[] = "Items is required and should be an array.";
            return $errors;
        }
        
        foreach ($input['items'] as $index => $item) {
            if (!is_array($item)){
                $errors[] = "items[$index] must be an object.";
                continue;
            }
            if (!isset($item['product_id']) || !is_numeric($item['product_id'])) {
                $errors[] = "items[$index].product_id is required and must be numeric.";
            }
            if (!isset($item['quantity']) || !is_numeric($item['quantity']) || (int) $item['quantity'] < 1) {
                $errors[] = "items[$index].quantity is required and must be an integer of at least 1.";
            }
            if (!isset($item['price']) || !is_numeric($item['price']) || (float) $item['price'] < 0) {
                $errors[] = "items[$index].price is required and must be a non-negative number.";
            }
        }
        return $errors;
    }

    public static function normalize(array $input): array
    {
        $items = array_map(static function($item){
            return [
                'product_id' => (int) $item['product_id'],
                'name' => $item['name'],
                'quantity' => (int) $item['quantity'],
                'price' => (float) $item['price'],
            ];
        }, $input['items']);

        $totalAmount = array_reduce($items, static function($carry, $item) {
            return $carry + ($item['price'] * $item['quantity']);
        },0.0);

        return [
            'table_number' => trim($input['table_number']),
            'customer_name' => isset($input['customer_name']) ? trim($input['customer_name']) : null,
            'items' => $items,
            'total_amount' => round($totalAmount, 2),
        ];
    }
}