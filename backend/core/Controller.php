<?php

require_once __DIR__ . '/../views/JsonResponse.php';
abstract class Controller
{
    protected function getJsonInput(): array
    {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);

        return is_array($data) ? $data : [];
    }

    protected function success($data = null, string $message = 'OK', int $statusCode = 200): void
    {
        JsonResponse::success($data, $message, $statusCode);
    }

    protected function error($data = null, int $statusCode = 400, $errors = null): void
    {
        JsonResponse::error($data, $statusCode, $errors);
    }

}