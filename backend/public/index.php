<?php

require_once __DIR__ . '/../config/Cors.php';
require_once __DIR__ . '/../core/Router.php';
require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../controllers/OrderController.php';

Cors::handle();

$router = new Router();

$productController = new ProductController();
$orderController = new OrderController();

$router->get('/api/products', [$productController, 'index']);
$router->get('/api/products/{id}', [$productController, 'show']);

$router->get('/api/orders', [$orderController, 'index']);
$router->get('/api/orders/{id}', [$orderController, 'show']);
$router->post('/api/orders', [$orderController, 'store']);
$router->put('/api/orders/{id}/status', [$orderController, 'updateStatus']);

$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);