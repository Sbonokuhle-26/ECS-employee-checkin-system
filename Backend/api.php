<?php
// Set headers FIRST
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Enable errors for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include required files
require_once 'config.php';

// Get the request method
$method = $_SERVER['REQUEST_METHOD'];

// Get the request URI
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);

// Extract endpoint
$endpoint = '';
if (strpos($path, 'api.php/') !== false) {
    $endpoint = substr($path, strpos($path, 'api.php/') + 8);
} else if (strpos($path, 'api.php') !== false) {
    $endpoint = '';
}

// Remove trailing slash
$endpoint = rtrim($endpoint, '/');

// Debug logging
error_log("API Request - Endpoint: '$endpoint', Method: $method, Full Path: '$path'");

try {
    // Simple router based on endpoint
    switch ($endpoint) {
        case '':
        case 'api.php':
            // Test endpoint
            echo json_encode([
                'success' => true,
                'message' => 'API is working!',
                'endpoint' => $endpoint,
                'method' => $method,
                'timestamp' => date('Y-m-d H:i:s')
            ]);
            break;
            
        case 'login':
            if ($method == 'POST') {
                require_once 'auth.php';
                login();
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed for login']);
            }
            break;
            
        // ... rest of your endpoints remain the same
        case 'check-in':
            if ($method == 'POST') {
                require_once 'checkin.php';
                checkIn();
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed for check-in']);
            }
            break;
            
        case 'checkout':
            if ($method == 'POST') {
                require_once 'checkin.php';
                checkOut();
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed for checkout']);
            }
            break;
            
        case 'last-checkinout':
            if ($method == 'GET') {
                require_once 'checkin.php';
                getLastCheckInOut();
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed for last-checkinout']);
            }
            break;
            
        case 'active-checkin':
            if ($method == 'GET') {
                require_once 'checkin.php';
                getActiveCheckin();
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed for active-checkin']);
            }
            break;
            
        case 'users':
            require_once 'users.php';
            switch ($method) {
                case 'GET': 
                    getUsers(); 
                    break;
                case 'POST': 
                    createUser(); 
                    break;
                case 'PUT': 
                    updateUser(); 
                    break;
                case 'DELETE': 
                    deleteUser(); 
                    break;
                default:
                    http_response_code(405);
                    echo json_encode(['error' => 'Method not allowed for users']);
            }
            break;
            
        case 'departments':
            if ($method == 'GET') {
                require_once 'users.php';
                getDepartments();
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed for departments']);
            }
            break;
            
        case 'reports':
            if ($method == 'GET') {
                require_once 'reports.php';
                getReports();
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed for reports']);
            }
            break;
            
        default:
            http_response_code(404);
            echo json_encode([
                'error' => 'Endpoint not found',
                'requested_endpoint' => $endpoint,
                'method' => $method,
                'available_endpoints' => ['login', 'check-in', 'checkout', 'last-checkinout', 'active-checkin', 'users', 'departments', 'reports']
            ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error: ' . $e->getMessage()]);
}
?>