<?php

require_once __DIR__ . '/../core/Model.php';

class Product extends Model
{
    public function availableOnly(): array
    {
        $stmt = $this->db->query(
            'SELECT id, name, description, price, category, image_url, is_available, created_at
            FROM products
            WHERE is_available = 1
            ORDER BY category, name'
        );
        return $stmt->fetchAll();
    }

    public function find(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT id, name, description, price, category, image_url, is_available, created_at
            FROM products
            WHERE id = :id'
        );
        $stmt->execute(['id' => $id]);

        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

}