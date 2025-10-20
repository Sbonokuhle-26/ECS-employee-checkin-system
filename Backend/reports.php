<?php
// Reporting functions
function getReports() {
    // Check if user is authorized (manager)
    $headers = apache_request_headers();
    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Authorization header required']);
        return;
    }
    
    $conn = getDBConnection();
    
    // Get filter parameters
    $employeeId = isset($_GET['employee_id']) ? $conn->real_escape_string($_GET['employee_id']) : NULL;
    $startDate = isset($_GET['start_date']) ? $conn->real_escape_string($_GET['start_date']) : date('Y-m-01');
    $endDate = isset($_GET['end_date']) ? $conn->real_escape_string($_GET['end_date']) : date('Y-m-t');
    
    // Build query
    $sql = "SELECT 
                e.employee_id,
                CONCAT(e.first_name, ' ', e.last_name) as employee_name,
                d.department_name,
                c.checkin_time,
                c.checkout_time,
                TIMESTAMPDIFF(MINUTE, c.checkin_time, c.checkout_time) as minutes_worked,
                ip.ip_address,
                c.location
            FROM checkin c
            JOIN employee e ON c.employee_id = e.employee_id
            JOIN department d ON e.department_id = d.department_id
            JOIN ip_address ip ON c.ip_address_id = ip.ip_address_id
            WHERE DATE(c.checkin_time) BETWEEN '$startDate' AND '$endDate'";
    
    if ($employeeId) {
        $sql .= " AND e.employee_id = $employeeId";
    }
    
    $sql .= " ORDER BY c.checkin_time DESC";
    
    $result = $conn->query($sql);
    $reports = [];
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $reports[] = $row;
        }
    }
    
    echo json_encode([
        'success' => true,
        'data' => $reports,
        'filters' => [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'employee_id' => $employeeId
        ]
    ]);
    
    $conn->close();
}
?>