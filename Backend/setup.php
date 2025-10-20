<?php
// Setup script to initialize the database with proper passwords
require_once 'config.php';

$conn = getDBConnection();

// Update passwords with proper hashing
$passwords = [
    1 => password_hash('demo123', PASSWORD_DEFAULT),
    2 => password_hash('demo123', PASSWORD_DEFAULT),
    3 => password_hash('demo123', PASSWORD_DEFAULT)
];

foreach ($passwords as $employeeId => $hashedPassword) {
    $sql = "UPDATE employee SET password = ? WHERE employee_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $hashedPassword, $employeeId);
    $stmt->execute();
    $stmt->close();
}

echo "Passwords updated successfully!";
echo "Default password for all users: demo123";

$conn->close();
?>