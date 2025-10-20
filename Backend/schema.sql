-- Create database
CREATE DATABASE IF NOT EXISTS employee_checkin_system;
USE employee_checkin_system;

-- Create tables
CREATE TABLE IF NOT EXISTS department (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS employee (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hire_date DATE NOT NULL,
    department_id INT,
    role ENUM('employee', 'manager', 'super_admin') DEFAULT 'employee',
    status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (department_id) REFERENCES department(department_id)
);

CREATE TABLE IF NOT EXISTS ip_address (
    ip_address_id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) UNIQUE NOT NULL,
    description VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS employee_allowed_ip (
    employee_id INT,
    ip_address_id INT,
    PRIMARY KEY (employee_id, ip_address_id),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (ip_address_id) REFERENCES ip_address(ip_address_id)
);

CREATE TABLE IF NOT EXISTS checkin (
    checkin_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    ip_address_id INT NOT NULL,
    checkin_time DATETIME NOT NULL,
    checkout_time DATETIME NULL,
    location VARCHAR(255) NULL,
    device_fingerprint VARCHAR(255) NULL,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (ip_address_id) REFERENCES ip_address(ip_address_id)
);

-- Insert sample data
INSERT INTO department (department_name) VALUES 
('Human Resources'),
('Information Technology'),
('Finance'),
('Marketing');

-- Insert employees with properly hashed passwords (password for all: demo123)
INSERT INTO employee (password, first_name, last_name, email, hire_date, department_id, role, status) VALUES 
('$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Doe', 'john.doe@company.com', '2023-01-15', 2, 'employee', 'active'),
('$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane', 'Smith', 'jane.smith@company.com', '2023-03-20', 1, 'manager', 'active'),
('$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bob', 'Johnson', 'bob.johnson@company.com', '2023-05-10', 3, 'employee', 'active'),
('$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'Super', 'admin@company.com', '2023-01-01', 2, 'super_admin', 'active');

INSERT INTO ip_address (ip_address, description) VALUES 
('192.168.1.100', 'Main Office Network'),
('192.168.1.101', 'Conference Room'),
('10.0.0.50', 'Remote Office'),
('127.0.0.1', 'Localhost');

INSERT INTO employee_allowed_ip (employee_id, ip_address_id) VALUES 
(1, 1), (1, 2), 
(2, 1), (2, 3), 
(3, 1), 
(4, 1), (4, 2), (4, 3), (4, 4);

-- Insert sample check-in data
INSERT INTO checkin (employee_id, ip_address_id, checkin_time, checkout_time, location) VALUES 
(1, 1, '2024-01-15 08:00:00', '2024-01-15 17:00:00', 'Office'),
(2, 1, '2024-01-15 08:30:00', '2024-01-15 17:30:00', 'Office'),
(3, 1, '2024-01-15 09:00:00', '2024-01-15 16:30:00', 'Office');

USE employee_checkin_system;

ALTER TABLE employee MODIFY COLUMN role ENUM('employee', 'manager', 'super_admin') DEFAULT 'employee';

INSERT IGNORE INTO employee (password, first_name, last_name, email, hire_date, department_id, role, status) VALUES 
('$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Super', 'Admin', 'superadmin@company.com', '2023-01-01', 2, 'super_admin', 'active');

INSERT IGNORE INTO employee_allowed_ip (employee_id, ip_address_id) 
SELECT e.employee_id, ip.ip_address_id 
FROM employee e, ip_address ip 
WHERE e.email = 'superadmin@company.com';

UPDATE employee SET role = 'super_admin' WHERE email = 'admin@company.com';