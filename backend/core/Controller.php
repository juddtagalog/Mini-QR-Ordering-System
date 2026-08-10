<?php

abstract class Controller
{
    protected function getJsonInput(): array
    {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);

        return is_array($data) ? $data : [];
    }

    protected function jsonResponse(array $payload, int $statusCode): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload);
        exit;
    }

    protected function success($data=null, string $message = 'OK', int $statusCode = 200): void
    {
        $this->jsonResponse([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    protected function error(string $message, int $statusCode = 400, $errors = null): void
    {
        $this->jsonResponse([
            'success' => false,
            'message'=> $message,
            'errors' => $errors,
        ], $statusCode);

    }
}