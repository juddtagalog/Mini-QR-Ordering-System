<?php

require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/../dto/CreateOrderDto.php';
require_once __DIR__ . '/../dto/UpdateOrderStatusDto.php';
require_once __DIR__ . '/../dto/OrderResponseDto.php';

class OrderController extends Controller
{
    private Order $orderModel;

    public function __construct()
    {
        $this->orderModel = new Order();
    }

    public function index(): void
    {
        $rows = $this->orderModel->all();
        $this->success(OrderResponseDto::fromRows($rows), 'Orders fetched.');

    }
    
    public function show(array $params): void
    {
        $id = (int) $params['id'] ?? 0;
        $row = $this->orderModel->find($id);

        if ($row === null){
            $this->error('Order not found.', 404);
            return;
        }
        $this->success(OrderResponseDto::fromRow($row), 'Order fetched.');
    }

    public function store(): void
    {
        $input = $this->getJsonInput();
        $errors = CreateOrderDto::validate($input);

        if (!empty($errors)){
            $this->error('Validation failed.', 422, $errors);
            return;
        }

        $normalized = CreateOrderDto::normalize($input);
        $orderId = $this->orderModel->create($normalized);
        $row = $this->orderModel->find($orderId);

        $this->success(OrderResponseDto::fromRow($row),'Order placed.', 201);
    }

    public function updateStatus(array $params): void
    {
        $id = (int) $params['id'] ?? 0;
        $input = $this->getJsonInput();
        $errors = UpdateOrderStatusDto::validate($input);

        if(!empty($errors)){
            $this->error('Validation failed.', 422, $errors);
            return;
        }

        $existing = $this->orderModel->find($id);
        if ($existing === null){
            $this->error('Order not found.', 404);
            return;
        }

        $status = UpdateOrderStatusDto::normalize($input);
        $this->orderModel->updateStatus($id, $status);
        $updated = $this->orderModel->find($id);

        $this->success(OrderResponseDto::fromRow($updated), 'Order status updated.');

    }
}