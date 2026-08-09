<?php

class Router
{
    private array $routes = [];
    
    public function get(string $path, callable $handler): void
    {
        $this->add('GET', $path, $handler);
    }

    public function post(string $path, callable $handler): void
    {
        $this->add('POST', $path, $handler);
    }

    public function put(string $path, callable $handler): void
    {
        $this->add('PUT', $path, $handler);
    }

    public function delete(string $path, callable $handler): void
    {
        $this->add('DELETE', $path, $handler);
    }

    public function add(string $method, string $path, callable $handler): void
    {
        $paramNames = $this->extractParamNames($path);
        $pattern = preg_replace('#\{[a-zA-Z_]+\}#', '([^/]+)', $path);
        $this->routes[] = [
            'method' =>strtoupper($method),
            'pattern' =>'#^' . $pattern . '$#',
            'paramNames' => $paramNames,
            'handler' => $handler
        ];
    }

    public function dispatch(string $method, string $uri): void
    {
        $path = parse_url($uri, PHP_URL_PATH) ?? '/';
        $path = rtrim($path, '/');
        if ($path === ''){
            $path ='/';
        }

        foreach ($this->routes as $route){
            if ($route['method'] !== strtoupper($method)){
                continue;
            }

            if (preg_match($route['pattern'], $path, $matches)) {
                array_shift($matches);
                $params = array_combine($route['paramNames'], $matches);
                call_user_func($route['handler'], $params);
                return;
            }
        }
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Route not found',
        ]);
    }

    private function extractParamNames(string $path): array
    {
        preg_match_all('#\{([a-zA-Z_]+)\}#', $path, $matches);
        return $matches[1];
    }

}