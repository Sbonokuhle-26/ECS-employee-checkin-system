<?php
// config.php
define('DB_HOST', 'localhost');
define('DB_USER', 'root'); 
define('DB_PASS', '');
define('DB_NAME', 'employee_checkin_system');

// Enable errors for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

function getDBConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        error_log("Database connection failed: " . $conn->connect_error);
        return false;
    }
    return $conn;
}

function authorize($requiredRole = null) {
    $headers = getallheaders();
    
    // For login endpoint, skip authorization
    $request_uri = $_SERVER['REQUEST_URI'];
    if (strpos($request_uri, 'login') !== false) {
        return true;
    }
    
    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Authorization header required']);
        return false;
    }
    
    $authHeader = $headers['Authorization'];
    
    // Handle both "Bearer token" and just "token" formats
    if (strpos($authHeader, 'Bearer ') === 0) {
        $token = substr($authHeader, 7);
    } else {
        $token = $authHeader;
    }
    
    // Decode the token
    $tokenData = json_decode(base64_decode($token), true);
    
    if (!$tokenData || !isset($tokenData['employee_id']) || !isset($tokenData['role'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid token structure']);
        return false;
    }
    
    // Check if token is expired
    if (isset($tokenData['exp']) && $tokenData['exp'] < time()) {
        http_response_code(401);
        echo json_encode(['error' => 'Token expired']);
        return false;
    }
    
    // Check role if required
    if ($requiredRole && $tokenData['role'] !== $requiredRole) {
        http_response_code(403);
        echo json_encode(['error' => 'Insufficient permissions. Required role: ' . $requiredRole]);
        return false;
    }
    
    return $tokenData;
}
?>