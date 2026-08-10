<?php

class ProductResponseDto
{
    public static function fromRow(array $row): array
    {
        return [
            'id'=> (int) $row['id'],
            'name'=> $row['name'],
            'description'=> $row['description'],
            'price'=> (float) $row['price'],
            'category'=> $row['category'],
            'image_url'=> $row['image_url'],
            'is_available'=> (bool) $row['is_available'],
            'created_at'=> $row['created_at'],
        ];
    }

    public static function fromRows(array $rows): array
    {
        return array_map([self::class, 'fromRow'], $rows);
    }
}