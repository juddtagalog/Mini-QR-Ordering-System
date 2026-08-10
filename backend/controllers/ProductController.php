<?php

require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../dto/ProductResponseDto.php';

class ProductController extends Controller
{
    private Product $productModel;

    public function __construct()
    {
        $this->productModel = new Product();
    }

    public function index(): void
    {
        $rows = $this->productModel->availableOnly();
        $this->success(ProductResponseDto::fromRows($rows), 'Products fetched');
    }

    public function show(array $params): void
    {
        $id = (int) $params['id'] ?? 0;
        $row = $this->productModel->find($id);

        if ($row === null){
            $this->error('Product not found.', 404);
            return;
        }

        $this->success(ProductResponseDto::fromRow($row), 'Product fetched.');
    }
}