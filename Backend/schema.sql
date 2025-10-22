-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 22, 2025 at 11:51 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `employee_checkin_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `checkin`
--

CREATE TABLE `checkin` (
  `checkin_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `ip_address_id` int(11) NOT NULL,
  `checkin_time` datetime NOT NULL,
  `checkout_time` datetime DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `device_fingerprint` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `checkin`
--

INSERT INTO `checkin` (`checkin_id`, `employee_id`, `ip_address_id`, `checkin_time`, `checkout_time`, `location`, `device_fingerprint`) VALUES
(1, 1, 1, '2024-01-15 08:00:00', '2024-01-15 17:00:00', 'Office', NULL),
(2, 2, 1, '2024-01-15 08:30:00', '2024-01-15 17:30:00', 'Office', NULL),
(3, 3, 1, '2024-01-15 09:00:00', '2024-01-15 16:30:00', 'Office', NULL),
(4, 4, 2, '2025-10-16 12:31:36', '2025-10-16 12:34:38', 'Office', 'eyJjYW52YXMiOiJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQU1nQUFBQXlDQVlBQUFBWlVaVGhBQUFKNjBsRVFWUjRYdTFiZlZCVTF4Vy9xNG1hRHhoUkFUVWhxQ1NrZm1WSzVFT3dxUU0yRFJxQmlSaVZRYzNIdVB0SXE4VHFaUHFITnFpTlNXdEtUUlBUN0h1Yk9CblVDSDRsUlpUWXFkcVlTcUtnYWR'),
(5, 2, 2, '2025-10-16 12:35:03', '2025-10-16 12:35:05', 'Office', 'eyJjYW52YXMiOiJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQU1nQUFBQXlDQVlBQUFBWlVaVGhBQUFKNjBsRVFWUjRYdTFiZlZCVTF4Vy9xNG1hRHhoUkFUVWhxQ1NrZm1WSzVFT3dxUU0yRFJxQmlSaVZRYzNIdVB0SXE4VHFaUHFITnFpTlNXdEtUUlBUN0h1Yk9CblVDSDRsUlpUWXFkcVlTcUtnYWR'),
(6, 4, 2, '2025-10-16 13:16:03', '2025-10-17 09:46:07', 'Office', 'eyJjYW52YXMiOiJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQU1nQUFBQXlDQVlBQUFBWlVaVGhBQUFKNjBsRVFWUjRYdTFiZlZCVTF4Vy9xNG1hRHhoUkFUVWhxQ1NrZm1WSzVFT3dxUU0yRFJxQmlSaVZRYzNIdVB0SXE4VHFaUHFITnFpTlNXdEtUUlBUN0h1Yk9CblVDSDRsUlpUWXFkcVlTcUtnYWR'),
(7, 2, 2, '2025-10-16 13:16:28', '2025-10-16 14:35:02', 'Office', 'eyJjYW52YXMiOiJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQU1nQUFBQXlDQVlBQUFBWlVaVGhBQUFKNjBsRVFWUjRYdTFiZlZCVTF4Vy9xNG1hRHhoUkFUVWhxQ1NrZm1WSzVFT3dxUU0yRFJxQmlSaVZRYzNIdVB0SXE4VHFaUHFITnFpTlNXdEtUUlBUN0h1Yk9CblVDSDRsUlpUWXFkcVlTcUtnYWR'),
(8, 5, 2, '2025-10-16 13:22:36', '2025-10-17 09:48:25', 'Office', 'eyJjYW52YXMiOiJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQU1nQUFBQXlDQVlBQUFBWlVaVGhBQUFKNjBsRVFWUjRYdTFiZlZCVTF4Vy9xNG1hRHhoUkFUVWhxQ1NrZm1WSzVFT3dxUU0yRFJxQmlSaVZRYzNIdVB0SXE4VHFaUHFITnFpTlNXdEtUUlBUN0h1Yk9CblVDSDRsUlpUWXFkcVlTcUtnYWR'),
(9, 5, 2, '2025-10-17 09:48:30', '2025-10-20 09:02:36', 'Office', 'eyJjYW52YXMiOiJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQU1nQUFBQXlDQVlBQUFBWlVaVGhBQUFKNjBsRVFWUjRYdTFiZlZCVTF4Vy9xNG1hRHhoUkFUVWhxQ1NrZm1WSzVFT3dxUU0yRFJxQmlSaVZRYzNIdVB0SXE4VHFaUHFITnFpTlNXdEtUUlBUN0h1Yk9CblVDSDRsUlpUWXFkcVlTcUtnYWR'),
(10, 2, 2, '2025-10-17 09:49:15', '2025-10-17 09:49:17', 'Office', 'eyJjYW52YXMiOiJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQU1nQUFBQXlDQVlBQUFBWlVaVGhBQUFKNjBsRVFWUjRYdTFiZlZCVTF4Vy9xNG1hRHhoUkFUVWhxQ1NrZm1WSzVFT3dxUU0yRFJxQmlSaVZRYzNIdVB0SXE4VHFaUHFITnFpTlNXdEtUUlBUN0h1Yk9CblVDSDRsUlpUWXFkcVlTcUtnYWR'),
(11, 5, 2, '2025-10-20 12:38:32', '2025-10-20 12:38:46', 'Office', '62527cf1'),
(12, 5, 2, '2025-10-20 12:38:57', '2025-10-20 12:39:00', 'Office', '62527cf1'),
(13, 5, 2, '2025-10-20 12:57:25', '2025-10-20 12:57:38', 'Office', '62527cf1'),
(14, 5, 2, '2025-10-20 13:56:17', '2025-10-21 08:36:13', 'Office', '62527cf1'),
(15, 5, 2, '2025-10-21 10:39:51', '2025-10-21 10:39:54', 'Office', '62527cf1'),
(16, 5, 2, '2025-10-21 10:39:57', '2025-10-21 11:58:29', 'Office', '62527cf1'),
(17, 4, 2, '2025-10-21 11:55:36', '2025-10-21 11:55:52', 'Office', '62527cf1'),
(18, 4, 2, '2025-10-21 11:55:54', '2025-10-22 10:41:59', 'Office', '62527cf1'),
(19, 2, 2, '2025-10-21 11:57:50', '2025-10-22 10:40:38', 'Office', '62527cf1'),
(20, 5, 2, '2025-10-22 08:51:55', '2025-10-22 08:52:23', 'Office', '62527cf1'),
(21, 6, 2, '2025-10-22 08:54:13', NULL, 'Office', '62527cf1'),
(22, 5, 2, '2025-10-22 08:55:17', '2025-10-22 08:55:31', 'Office', '62527cf1'),
(23, 5, 2, '2025-10-22 08:55:41', '2025-10-22 11:28:15', 'Office', '62527cf1');

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `department_id` int(11) NOT NULL,
  `department_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`department_id`, `department_name`) VALUES
(3, 'Finance'),
(1, 'Human Resources'),
(2, 'Information Technology'),
(4, 'Marketing');

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `employee_id` int(11) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `hire_date` date NOT NULL,
  `department_id` int(11) DEFAULT NULL,
  `role` enum('employee','manager','super_admin') DEFAULT 'employee',
  `status` enum('active','inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`employee_id`, `password`, `first_name`, `last_name`, `email`, `hire_date`, `department_id`, `role`, `status`) VALUES
(1, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Doe', 'john@fcasey.com', '2023-01-15', 2, 'employee', 'active'),
(2, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane', 'Smith', 'janesmith@fcasey.com', '2023-03-20', 1, 'manager', 'active'),
(3, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bob', 'Johnson', 'bobjohnson@fcasey.com', '2023-05-10', 3, 'employee', 'active'),
(4, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'Super', 'admin@company.com', '2023-01-01', 2, 'super_admin', 'active'),
(5, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Siphephelo', 'Zisongo', 'siphephelo@fcasey.com', '2023-01-01', 2, 'employee', 'active'),
(6, '$2y$10$FVBxQWxCFwvLYyEBuVUg9.uQ2tnwlH.2pEcJzOoZ/oz4HZI/1bcjm', 'Hiswona', 'Mabunda', 'hiswona@fcasey.com', '2025-10-17', 1, 'employee', 'active'),
(8, '$2y$10$3gC727diq63c2pjGm4UkwuLq1XN1gicR.rg.ag0.o.0/VrWZiJUsG', 'Uzobusa', 'Zisongo', 'uzobusa@fcasey.com', '2025-10-17', 2, 'manager', 'active'),
(10, '$2y$10$MTzFOE7xXDl4GKF9xv5ncOccKSWmfP82diauRjdF/84pFAk7iNvfW', 'Zibusiso', 'Zisongo', 'zibusiso@fcasey.com', '2025-10-17', 2, 'manager', 'active'),
(12, '$2y$10$yALBa9OL9zLViSRwIjXFFOQMLK0TmvEmxIQjTG4eDymm.jwNuzUAO', 'Akwande', 'Zisongo', 'akwande@fcasey.com', '2025-10-17', 4, 'employee', 'active'),
(14, '$2y$10$9QBrzgBaXnnBQBcUc2PmFORmEWrbfj12RYK1Hy.9lLlwY2zobH17a', 'Theo', 'Mabunda', 'theo@fcasey.com', '2025-10-21', 1, 'employee', 'active'),
(15, '$2y$10$b18x0eGi2d4ph/KfobnHR.xVjCwtr9CKKtF6xOfHzaSpEnNELjle6', 'Sipho', 'Ngwenya', 'sipho@fcasey.com', '2025-10-22', 1, 'employee', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `employee_allowed_ip`
--

CREATE TABLE `employee_allowed_ip` (
  `employee_id` int(11) NOT NULL,
  `ip_address_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_allowed_ip`
--

INSERT INTO `employee_allowed_ip` (`employee_id`, `ip_address_id`) VALUES
(1, 1),
(1, 2),
(1, 5),
(2, 2),
(2, 3),
(2, 5),
(3, 1),
(3, 5),
(4, 1),
(4, 2),
(4, 3),
(4, 4),
(4, 5),
(5, 2),
(6, 2),
(8, 2),
(10, 2),
(12, 2),
(14, 2),
(15, 1);

-- --------------------------------------------------------

--
-- Table structure for table `ip_address`
--

CREATE TABLE `ip_address` (
  `ip_address_id` int(11) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ip_address`
--

INSERT INTO `ip_address` (`ip_address_id`, `ip_address`, `description`, `is_active`) VALUES
(1, '192.168.1.100', 'Main Office Network', 2),
(2, '102.213.159.26', 'Conference Room', 1),
(3, '10.0.0.50', 'Remote Office', 1),
(4, '127.0.0.1', 'Localhost', 1),
(5, '0.0.0.0', 'Any IP - Development', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `checkin`
--
ALTER TABLE `checkin`
  ADD PRIMARY KEY (`checkin_id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `ip_address_id` (`ip_address_id`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`department_id`),
  ADD UNIQUE KEY `department_name` (`department_name`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`employee_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `department_id` (`department_id`);

--
-- Indexes for table `employee_allowed_ip`
--
ALTER TABLE `employee_allowed_ip`
  ADD PRIMARY KEY (`employee_id`,`ip_address_id`),
  ADD KEY `ip_address_id` (`ip_address_id`);

--
-- Indexes for table `ip_address`
--
ALTER TABLE `ip_address`
  ADD PRIMARY KEY (`ip_address_id`),
  ADD UNIQUE KEY `ip_address` (`ip_address`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `checkin`
--
ALTER TABLE `checkin`
  MODIFY `checkin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `department_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `employee_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `ip_address`
--
ALTER TABLE `ip_address`
  MODIFY `ip_address_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `checkin`
--
ALTER TABLE `checkin`
  ADD CONSTRAINT `checkin_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`),
  ADD CONSTRAINT `checkin_ibfk_2` FOREIGN KEY (`ip_address_id`) REFERENCES `ip_address` (`ip_address_id`);

--
-- Constraints for table `employee`
--
ALTER TABLE `employee`
  ADD CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`);

--
-- Constraints for table `employee_allowed_ip`
--
ALTER TABLE `employee_allowed_ip`
  ADD CONSTRAINT `employee_allowed_ip_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`),
  ADD CONSTRAINT `employee_allowed_ip_ibfk_2` FOREIGN KEY (`ip_address_id`) REFERENCES `ip_address` (`ip_address_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
