<?php

require_once __DIR__ . '/../config/Database.php';

abstract class Model
{
    protected PDO $db;
    public function __construct(?PDO $db = null)
    {
        $this->db = $db ?? Database::getConnection();
    }
}