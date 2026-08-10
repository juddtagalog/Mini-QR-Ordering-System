<?php

class OrderResponseDto
{
    public static function fromRow(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'customer_name' => $row['customer_name'],
            'table_number' => (int) $row['table_number'],
            'items' => json_decode($row['items'], true) ?? [],
            'total_amount' => (float) $row['total_amount'],
            'status' => $row['status'],
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at'],
        ];
    }

    public static function fromRows(array $rows): array
    {
        return array_map([self::class, 'fromRow'], $rows);
    }
}