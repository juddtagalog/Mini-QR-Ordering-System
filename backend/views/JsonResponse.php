<?php

class JsonResponse
{
    public static function send(int $statusCode, array $payLoad): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payLoad);
        exit;
    }
    
    public static function success($data = null, string $message = 'OK', int $statusCode = 200): void
    {
        self::send($statusCode, [
            'success' => true,
            'message' => $message,
            'data' => $data,
        ]);
    }

    public static function error(string $message, int $statusCode = 400, $errors = null): void
    {
        self::send($statusCode, [
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ]);
    }
}