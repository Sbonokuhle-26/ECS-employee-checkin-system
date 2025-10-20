<?php

function checkIn() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if (!isset($data['employee_id']) || !isset($data['ip_address'])) {
        http_response_code(400); 
        echo json_encode(['error' => 'Employee ID and IP address are required']);
        return;
    }
    
    $conn = getDBConnection();
    $employeeId = $conn->real_escape_string($data['employee_id']);
    $ipAddress = $conn->real_escape_string($data['ip_address']);
    
    // Check if IP is allowed for this employee
    $ipCheckSql = "SELECT ip.ip_address_id FROM ip_address ip 
                  JOIN employee_allowed_ip eip ON ip.ip_address_id = eip.ip_address_id 
                  WHERE eip.employee_id = $employeeId AND ip.ip_address = '$ipAddress' AND ip.is_active = 1";
    $ipResult = $conn->query($ipCheckSql);
    
    if ($ipResult->num_rows == 0) {
        http_response_code(403);
        echo json_encode(['error' => 'Check-in not allowed from this IP address']);
        $conn->close();
        return;
    }
    
    $ipRow = $ipResult->fetch_assoc();
    $ipAddressId = $ipRow['ip_address_id'];
    
    // Check if employee already has an active check-in
    $activeCheckinSql = "SELECT checkin_id FROM checkin WHERE employee_id = $employeeId AND checkout_time IS NULL";
    $activeResult = $conn->query($activeCheckinSql);
    
    if ($activeResult->num_rows > 0) {
        $activeRow = $activeResult->fetch_assoc();
        echo json_encode([
            'success' => false,
            'error' => 'You already have an active check-in. Please check out first.',
            'active_checkin_id' => $activeRow['checkin_id']
        ]);
        $conn->close();
        return;
    }
    
    // Record check-in
    $checkinTime = date('Y-m-d H:i:s');
    $location = isset($data['location']) ? $conn->real_escape_string($data['location']) : NULL;
    $deviceFingerprint = isset($data['device_fingerprint']) ? $conn->real_escape_string($data['device_fingerprint']) : NULL;
    
    $insertSql = "INSERT INTO checkin (employee_id, ip_address_id, checkin_time, location, device_fingerprint) 
                  VALUES ($employeeId, $ipAddressId, '$checkinTime', '$location', '$deviceFingerprint')";
    
    if ($conn->query($insertSql)) {
        $checkinId = $conn->insert_id;
        echo json_encode([
            'success' => true,
            'checkin_id' => $checkinId,
            'checkin_time' => $checkinTime,
            'message' => 'Check-in recorded successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to record check-in: ' . $conn->error]);
    }
    
    $conn->close();
}

function checkOut() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if (!isset($data['employee_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Employee ID is required']);
        return;
    }
    
    $conn = getDBConnection();
    $employeeId = $conn->real_escape_string($data['employee_id']);
    
    // Get active check-in for this employee
    $activeCheckinSql = "SELECT checkin_id FROM checkin WHERE employee_id = $employeeId AND checkout_time IS NULL";
    $activeResult = $conn->query($activeCheckinSql);
    
    if ($activeResult->num_rows == 0) {
        http_response_code(400);
        echo json_encode(['error' => 'No active check-in found for this employee']);
        $conn->close();
        return;
    }
    
    $checkinRow = $activeResult->fetch_assoc();
    $checkinId = $checkinRow['checkin_id'];
    
    // Record check-out
    $checkoutTime = date('Y-m-d H:i:s');
    
    $updateSql = "UPDATE checkin SET checkout_time = '$checkoutTime' WHERE checkin_id = $checkinId";
    
    if ($conn->query($updateSql)) {
        echo json_encode([
            'success' => true,
            'checkout_time' => $checkoutTime,
            'message' => 'Check-out recorded successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to record check-out: ' . $conn->error]);
    }
    
    $conn->close();
}

function getLastCheckInOut() {
    $employeeId = isset($_GET['employee_id']) ? intval($_GET['employee_id']) : null;
    
    if (!$employeeId) {
        http_response_code(400);
        echo json_encode(['error' => 'Employee ID is required']);
        return;
    }
    
    $conn = getDBConnection();
    
    // Get last check-in
    $lastCheckinSql = "SELECT checkin_time FROM checkin 
                      WHERE employee_id = $employeeId 
                      ORDER BY checkin_time DESC 
                      LIMIT 1";
    $lastCheckinResult = $conn->query($lastCheckinSql);
    $lastCheckin = $lastCheckinResult->num_rows > 0 ? $lastCheckinResult->fetch_assoc()['checkin_time'] : null;
    
    // Get last check-out
    $lastCheckoutSql = "SELECT checkout_time FROM checkin 
                       WHERE employee_id = $employeeId 
                       AND checkout_time IS NOT NULL 
                       ORDER BY checkout_time DESC 
                       LIMIT 1";
    $lastCheckoutResult = $conn->query($lastCheckoutSql);
    $lastCheckout = $lastCheckoutResult->num_rows > 0 ? $lastCheckoutResult->fetch_assoc()['checkout_time'] : null;
    
    // Check for active check-in
    $activeCheckinSql = "SELECT checkin_id FROM checkin WHERE employee_id = $employeeId AND checkout_time IS NULL";
    $activeResult = $conn->query($activeCheckinSql);
    $hasActiveCheckin = $activeResult->num_rows > 0;
    $activeCheckinId = $hasActiveCheckin ? $activeResult->fetch_assoc()['checkin_id'] : null;
    
    echo json_encode([
        'success' => true,
        'data' => [
            'last_checkin' => $lastCheckin,
            'last_checkout' => $lastCheckout,
            'has_active_checkin' => $hasActiveCheckin,
            'active_checkin_id' => $activeCheckinId
        ]
    ]);
    
    $conn->close();
}

function getActiveCheckin() {
    $employeeId = isset($_GET['employee_id']) ? intval($_GET['employee_id']) : null;
    
    if (!$employeeId) {
        http_response_code(400);
        echo json_encode(['error' => 'Employee ID is required']);
        return;
    }
    
    $conn = getDBConnection();
    
    $sql = "SELECT checkin_id, checkin_time, location 
            FROM checkin 
            WHERE employee_id = $employeeId AND checkout_time IS NULL 
            ORDER BY checkin_time DESC 
            LIMIT 1";
    
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $checkin = $result->fetch_assoc();
        echo json_encode([
            'success' => true,
            'has_active_checkin' => true,
            'checkin' => $checkin
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'has_active_checkin' => false
        ]);
    }
    
    $conn->close();
}
?>