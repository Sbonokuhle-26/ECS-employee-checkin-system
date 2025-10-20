<?php
// User management functions
function getUsers() {
    $tokenData = authorize();
    if (!$tokenData) {
        return;
    }
    
    // Allow managers and super_admins to view users
    if ($tokenData['role'] !== 'manager' && $tokenData['role'] !== 'super_admin') {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'error' => 'Insufficient permissions. Manager or Super Admin role required.'
        ]);
        return;
    }

    $conn = getDBConnection();
    
    $sql = "SELECT 
                e.employee_id,
                e.first_name,
                e.last_name,
                e.email,
                e.hire_date,
                e.status,
                e.role,
                d.department_id,
                d.department_name
            FROM employee e
            LEFT JOIN department d ON e.department_id = d.department_id
            ORDER BY e.first_name, e.last_name";
    
    $result = $conn->query($sql);
    $users = [];
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Get allowed IP addresses for each user
            $ipSql = "SELECT ip.ip_address_id, ip.ip_address, ip.description 
                      FROM ip_address ip 
                      JOIN employee_allowed_ip eip ON ip.ip_address_id = eip.ip_address_id 
                      WHERE eip.employee_id = " . $row['employee_id'];
            $ipResult = $conn->query($ipSql);
            $allowedIPs = [];
            
            if ($ipResult) {
                while ($ipRow = $ipResult->fetch_assoc()) {
                    $allowedIPs[] = $ipRow;
                }
            }
            
            $row['allowed_ips'] = $allowedIPs;
            $users[] = $row;
        }
    }
    
    echo json_encode([
        'success' => true,
        'data' => $users
    ]);
    
    $conn->close();
}

function createUser() {
    // First authorize without specific role requirement
    $tokenData = authorize();
    if (!$tokenData) {
        return;
    }
    
    // Check if user has required role (manager or super_admin)
    if ($tokenData['role'] !== 'manager' && $tokenData['role'] !== 'super_admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Insufficient permissions. Manager or Super Admin role required.']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if (!isset($data['first_name']) || !isset($data['last_name']) || !isset($data['email']) || !isset($data['department_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'First name, last name, email, and department are required']);
        return;
    }
    
    $conn = getDBConnection();
    
    // Check if email already exists
    $email = $conn->real_escape_string($data['email']);
    $checkSql = "SELECT employee_id FROM employee WHERE email = '$email'";
    $checkResult = $conn->query($checkSql);
    
    if ($checkResult->num_rows > 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Email already exists']);
        $conn->close();
        return;
    }
    
    // Prepare data
    $firstName = $conn->real_escape_string($data['first_name']);
    $lastName = $conn->real_escape_string($data['last_name']);
    $departmentId = intval($data['department_id']);
    $role = isset($data['role']) ? $conn->real_escape_string($data['role']) : 'employee';
    $status = isset($data['status']) ? $conn->real_escape_string($data['status']) : 'active';
    $password = isset($data['password']) ? $conn->real_escape_string($data['password']) : 'demo123';
    
    // Only super_admin can create super_admin
    if ($role === 'super_admin' && $tokenData['role'] !== 'super_admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Only Super Admin can create Super Admin users']);
        $conn->close();
        return;
    }
    
    // Only super_admin can create managers (managers cannot create other managers)
    if ($role === 'manager' && $tokenData['role'] === 'manager') {
        http_response_code(403);
        echo json_encode(['error' => 'Managers cannot create other managers']);
        $conn->close();
        return;
    }
    
    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert employee
    $sql = "INSERT INTO employee (first_name, last_name, email, password, hire_date, department_id, role, status) 
            VALUES (?, ?, ?, ?, CURDATE(), ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssiss", $firstName, $lastName, $email, $hashedPassword, $departmentId, $role, $status);
    
    if ($stmt->execute()) {
        $employeeId = $conn->insert_id;
        
        // Handle allowed IP addresses
        if (isset($data['allowed_ips']) && is_array($data['allowed_ips'])) {
            foreach ($data['allowed_ips'] as $ipData) {
                if (!empty($ipData['ip_address'])) {
                    $ipAddress = $conn->real_escape_string($ipData['ip_address']);
                    $description = isset($ipData['description']) ? $conn->real_escape_string($ipData['description']) : '';
                    
                    // Check if IP already exists
                    $ipCheckSql = "SELECT ip_address_id FROM ip_address WHERE ip_address = '$ipAddress'";
                    $ipResult = $conn->query($ipCheckSql);
                    
                    if ($ipResult->num_rows > 0) {
                        $ipRow = $ipResult->fetch_assoc();
                        $ipAddressId = $ipRow['ip_address_id'];
                    } else {
                        // Create new IP address
                        $ipInsertSql = "INSERT INTO ip_address (ip_address, description) VALUES ('$ipAddress', '$description')";
                        if ($conn->query($ipInsertSql)) {
                            $ipAddressId = $conn->insert_id;
                        } else {
                            continue;
                        }
                    }
                    
                    // Link IP to employee
                    $linkSql = "INSERT INTO employee_allowed_ip (employee_id, ip_address_id) VALUES ($employeeId, $ipAddressId)";
                    $conn->query($linkSql);
                }
            }
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'User created successfully',
            'employee_id' => $employeeId
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create user: ' . $conn->error]);
    }
    
    $stmt->close();
    $conn->close();
}

function updateUser() {
    
    $tokenData = authorize();
    if (!$tokenData) {
        return;
    }
    
    // Check if user has required role (manager or super_admin)
    if ($tokenData['role'] !== 'manager' && $tokenData['role'] !== 'super_admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Insufficient permissions. Manager or Super Admin role required.']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['employee_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Employee ID is required']);
        return;
    }
    
    
    $conn = getDBConnection();
    $employeeId = intval($data['employee_id']);
    
    // Check if user exists and get current role
    $userCheckSql = "SELECT role FROM employee WHERE employee_id = $employeeId";
    $userResult = $conn->query($userCheckSql);
    
    if ($userResult->num_rows == 0) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
        $conn->close();
        return;
    }
    
    $userRow = $userResult->fetch_assoc();
    $currentRole = $userRow['role'];
    
    // Permission checks
    if ($tokenData['role'] === 'manager') {
    // Managers cannot edit other managers 
    if ($currentRole === 'manager' && $employeeId != $tokenData['employee_id']) {
        http_response_code(403);
        echo json_encode(['error' => 'Managers cannot edit other managers\' profiles']);
        $conn->close();
        return;
    }
        
        // Managers cannot change roles to manager or super_admin
        if (isset($data['role']) && ($data['role'] === 'manager' || $data['role'] === 'super_admin')) {
        http_response_code(403);
        echo json_encode(['error' => 'Managers cannot assign manager or super admin roles']);
        $conn->close();
        return;
    }
}
    
    // Super Admin specific checks
    if ($tokenData['role'] === 'super_admin') {
    // Super Admin cannot change their own role
    if ($employeeId == $tokenData['employee_id'] && isset($data['role']) && $data['role'] !== 'super_admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Super Admin cannot change their own role']);
        $conn->close();
        return;
    }
}
    
    // Build update query dynamically based on provided fields
    $updateFields = [];
    $params = [];
    $types = '';
    
    if (isset($data['first_name'])) {
        $updateFields[] = "first_name = ?";
        $params[] = $conn->real_escape_string($data['first_name']);
        $types .= 's';
    }
    
    if (isset($data['last_name'])) {
        $updateFields[] = "last_name = ?";
        $params[] = $conn->real_escape_string($data['last_name']);
        $types .= 's';
    }
    
    if (isset($data['email'])) {
        // Check if email is unique (excluding current user)
        $email = $conn->real_escape_string($data['email']);
        $checkSql = "SELECT employee_id FROM employee WHERE email = '$email' AND employee_id != $employeeId";
        $checkResult = $conn->query($checkSql);
        
        if ($checkResult->num_rows > 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Email already exists']);
            $conn->close();
            return;
        }
        
        $updateFields[] = "email = ?";
        $params[] = $email;
        $types .= 's';
    }
    
    if (isset($data['department_id'])) {
        $updateFields[] = "department_id = ?";
        $params[] = intval($data['department_id']);
        $types .= 'i';
    }
    
    if (isset($data['role'])) {
        $updateFields[] = "role = ?";
        $params[] = $conn->real_escape_string($data['role']);
        $types .= 's';
    }
    
    if (isset($data['status'])) {
        $updateFields[] = "status = ?";
        $params[] = $conn->real_escape_string($data['status']);
        $types .= 's';
    }
    
    if (isset($data['password']) && !empty($data['password'])) {
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        $updateFields[] = "password = ?";
        $params[] = $hashedPassword;
        $types .= 's';
    }
    
    if (empty($updateFields)) {
        http_response_code(400);
        echo json_encode(['error' => 'No fields to update']);
        $conn->close();
        return;
    }
    
    $sql = "UPDATE employee SET " . implode(', ', $updateFields) . " WHERE employee_id = ?";
    $params[] = $employeeId;
    $types .= 'i';
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    
    if ($stmt->execute()) {
        // Update allowed IP addresses if provided
        if (isset($data['allowed_ips']) && is_array($data['allowed_ips'])) {
            // Remove existing IP associations
            $deleteSql = "DELETE FROM employee_allowed_ip WHERE employee_id = $employeeId";
            $conn->query($deleteSql);
            
            // Add new IP associations
            foreach ($data['allowed_ips'] as $ipData) {
                if (!empty($ipData['ip_address'])) {
                    $ipAddress = $conn->real_escape_string($ipData['ip_address']);
                    $description = isset($ipData['description']) ? $conn->real_escape_string($ipData['description']) : '';
                    
                    // Check if IP already exists
                    $ipCheckSql = "SELECT ip_address_id FROM ip_address WHERE ip_address = '$ipAddress'";
                    $ipResult = $conn->query($ipCheckSql);
                    
                    if ($ipResult->num_rows > 0) {
                        $ipRow = $ipResult->fetch_assoc();
                        $ipAddressId = $ipRow['ip_address_id'];
                    } else {
                        // Create new IP address
                        $ipInsertSql = "INSERT INTO ip_address (ip_address, description) VALUES ('$ipAddress', '$description')";
                        if ($conn->query($ipInsertSql)) {
                            $ipAddressId = $conn->insert_id;
                        } else {
                            continue;
                        }
                    }
                    
                    // Link IP to employee
                    $linkSql = "INSERT INTO employee_allowed_ip (employee_id, ip_address_id) VALUES ($employeeId, $ipAddressId)";
                    $conn->query($linkSql);
                }
            }
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'User updated successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update user: ' . $conn->error]);
    }
    
    $stmt->close();
    $conn->close();
}

function deleteUser() {
    // First try to authorize without specific role requirement
    $tokenData = authorize();
    if (!$tokenData) {
        return;
    }
    
    // Check if user has required role (manager or super_admin)
    if ($tokenData['role'] !== 'manager' && $tokenData['role'] !== 'super_admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Insufficient permissions. Manager or Super Admin role required.']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['employee_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Employee ID is required']);
        return;
    }
    
    $conn = getDBConnection();
    $employeeId = intval($data['employee_id']);
    
    // Check if user exists and get role
    $checkSql = "SELECT employee_id, role FROM employee WHERE employee_id = $employeeId";
    $checkResult = $conn->query($checkSql);
    
    if ($checkResult->num_rows == 0) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
        $conn->close();
        return;
    }
    
    $userRow = $checkResult->fetch_assoc();
    $userRole = $userRow['role'];
    
    // Permission checks
    if ($tokenData['role'] === 'manager') {
        // Managers cannot delete other managers
        if ($userRole === 'manager') {
            http_response_code(403);
            echo json_encode(['error' => 'Managers cannot delete other managers']);
            $conn->close();
            return;
        }
        
        // Managers cannot delete themselves 
        if ($employeeId == $tokenData['employee_id']) {
            http_response_code(403);
            echo json_encode(['error' => 'Cannot delete your own account through user management']);
            $conn->close();
            return;
        }
    }
    
    // Super Admin specific checks
    if ($tokenData['role'] === 'super_admin') {
        // Super Admin cannot delete themselves
        if ($employeeId == $tokenData['employee_id']) {
            http_response_code(403);
            echo json_encode(['error' => 'Super Admin cannot delete their own account']);
            $conn->close();
            return;
        }
    }
    
    
    // First delete related records
    $conn->query("DELETE FROM employee_allowed_ip WHERE employee_id = $employeeId");
    
    // Archive checkin records instead of deleting them
    $archiveSql = "UPDATE checkin SET employee_id = NULL WHERE employee_id = $employeeId";
    $conn->query($archiveSql);
    
    // Then delete the employee
    $sql = "DELETE FROM employee WHERE employee_id = $employeeId";
    
    if ($conn->query($sql)) {
        echo json_encode([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete user: ' . $conn->error]);
    }
    
    $conn->close();
}
// Department functions
function getDepartments() {
    $tokenData = authorize();
    if (!$tokenData) return;
    
    $conn = getDBConnection();
    
    $sql = "SELECT * FROM department ORDER BY department_name";
    
    $result = $conn->query($sql);
    $departments = [];
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $departments[] = $row;
        }
    }
    
    echo json_encode([
        'success' => true,
        'data' => $departments
    ]);
    
    $conn->close();
}

// Check if user can edit another user (helper function)
function canEditUser($editorRole, $editorId, $targetId, $targetRole) {
    if ($editorRole === 'super_admin') {
        return true; // Super Admin can edit anyone
    }
    
    if ($editorRole === 'manager') {
        // Managers can only edit employees, not other managers
        if ($targetRole === 'employee') {
            return true;
        }
        // Managers can edit their own profile even if they are managers
        if ($targetId == $editorId && $targetRole === 'manager') {
            return true;
        }
    }
    
    if ($editorRole === 'employee') {
        // Employees can only edit their own profile
        return $targetId == $editorId;
    }
    
    return false;
}

// Check if user can delete another user (helper function)
function canDeleteUser($deleterRole, $deleterId, $targetId, $targetRole) {
    if ($deleterRole === 'super_admin') {
        // Super Admin cannot delete themselves
        return $targetId != $deleterId;
    }
    
    if ($deleterRole === 'manager') {
        // Managers can only delete employees, not other managers or themselves
        return $targetRole === 'employee' && $targetId != $deleterId;
    }
    
    return false;
}
?>