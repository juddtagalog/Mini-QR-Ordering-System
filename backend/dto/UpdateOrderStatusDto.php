<?php

class UpdateOrderStatusDto
{
    private const VALID_STATUSES = ['Pending', 'Paid', 'Failed'];
    public static function validate(array $input): array
    {
        $errors = [];

        if(empty($input['status']) || !is_string($input['status'])){
            $errors[] = 'Status is required and should be a string.';
            return $errors;
        }

        if (!in_array($input['status'], self::VALID_STATUSES, true)) {
            $errors[] = 'status must be one of: ' . implode(', ', self::VALID_STATUSES) . '.';
        }
        return $errors;
    }

    public static function normalize(array $input): array
    {
        return $input['status'];
    }
}