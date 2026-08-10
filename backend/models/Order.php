<?php
require_once __DIR__ . '/../core/Model.php';
class Order extends Model
{
    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO orders (table_number, customer_name, items, total_amount, status)
                VALUES (:table_number, :customer_name, :items, :total_amount, :status)'
        );

        $stmt->execute([
            'table_number' => $data['table_number'],
            'customer_name' => $data['customer_name'],
            'items' => json_encode($data['items']),
            'total_amount' => $data['total_amount'],
            'status' => 'Pending'
        ]);

        return (int) $this->db->LastInsertId();
    }

    public function all(): array
    {
        $stmt = $this->db->query(
            'SELECT id, table_number, customer_name, items, total_amount, status, created_at, updated_at
             FROM orders
             ORDER BY created_at DESC'
        );

        return $stmt->fetchAll();
    }

    public function find(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT id, table_number, customer_name, items, total_amount, status, created_at, updated_at
             FROM orders
             WHERE id = :id'
        );
        $stmt->execute(['id' => $id]);

        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    public function updateStatus(int $id, string $status): bool
    {
        $stmt = $this->db->prepare('UPDATE orders SET status = :status WHERE id = :id');

        return $stmt->execute([
            'status' => $status,
            'id' => $id,
        ]);
    }
}