<?php
require_once __DIR__ . '/../core/Env.php';
Env::load(__DIR__ . '/../.env');
class Database
{
    private static ?PDO $instance = null;
    private function __construct() {}
    
    public static function getConnection(): PDO
    {
        if (self::$instance === null){
            $host = $_ENV['DB_HOST'];
            $port = $_ENV['DB_PORT'];
            $dbname = $_ENV['DB_NAME'];
            $username = $_ENV['DB_USER'];
            $password = $_ENV['DB_PASSWORD'];

            $dsn = 'mysql:host=' . $host
                . ';port=' . $port
                . ';dbname=' . $dbname
                . ';charset=utf8mb4';
            
            try{
                self::$instance = new PDO($dsn, $username, $password, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]);
            } catch (PDOException $e){
                http_response_code(500);
                header('Content-Type: application/json');
                echo json_encode([
                    'success' => false,
                    'message' => 'Database connection failed:' . $e->getMessage()
                ]);
                exit;
            }
        }
        return self::$instance;
    }
}