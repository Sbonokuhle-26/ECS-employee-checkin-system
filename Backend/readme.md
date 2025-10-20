Employee Check-In System
A comprehensive web-based employee attendance tracking system with role-based access control, IP restriction, and reporting capabilities.

 Table of Contents
1. Overview
2. Features
3. System Requirements
4. Installation
5. Database Setup
6. Configuration
7. User Roles & Permissions
8. API Endpoints
9. File Structure
10. Usage
11. Security Features
12. Troubleshooting

1. Overview
The Employee Check-In System is a PHP-based web application that allows organizations to track employee attendance with enhanced security features like IP-based access control and role-based permissions. The system provides different dashboards for employees, managers, and super administrators.

2. Features
2.1 Authentication & Security
Role-based access control (Employee, Manager, Super Admin)
IP-based check-in restrictions
JWT-like token authentication
Password hashing with bcrypt
Session management

2.2 Attendance Management
Check-in/Check-out functionality
Real-time status tracking
Attendance history
Active session detection
Location and device tracking

2.3 User Management
Employee profile management
Department-based organization
Bulk user operations
Role assignment
Status management (active/inactive)

2.4 Reporting & Analytics
Attendance reports with filters
CSV export functionality
Department-wise analytics
Time tracking and calculations

2.5 User Interface
Responsive design
Role-specific dashboards
Interactive modals and forms
Real-time notifications

3. System Requirements
Web Server: Apache/Nginx
PHP: 7.4 or higher
Database: MySQL 5.7+ or MariaDB
Browser: Modern browsers with JavaScript enabled
Extensions: PHP MySQLi, JSON

4. Installation
4.1. Download and Extract
bash
# Clone or download the project files
# Extract to your web server directory
cd /var/www/html/
4.2. Set Up Database
sql
-- Import the schema from schema.sql
mysql -u root -p < schema.sql
4.3. Configure Database
Edit Backend/config.php with your database credentials:
php
define('DB_HOST', 'localhost');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
define('DB_NAME', 'employee_checkin_system');
4.4. Set Permissions
bash
# Ensure proper file permissions
chmod 755 Backend/
chmod 644 Backend/*.php

4.5. Run Setup (Optional)
bash
# Run setup to initialize passwords
php Backend/setup.php

5. Database Setup
5.1 The system uses the following main tables:
employee: User accounts and profile
department: Department information
ip_address: Allowed IP addresses
employee_allowed_ip: IP restrictions per employee
checkin: Attendance records

5.2 Default Data
The system comes with sample data:
4 departments: HR, IT, Finance, Marketing
4 default users with password demo123
Sample IP addresses for testing

6. Configuration
6.1 Backend Configuration (config.php)
Database connection settings
Error reporting levels
Authorization functions

6.2 CORS Configuration
The API includes CORS headers for cross-origin requests:
php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

7. User Roles & Permissions
7.1. Employee
View personal dashboard
Check-in/Check-out
View personal attendance history
Update own profile (limited)

7.2. Manager
All Employee permissions
View team members
Generate reports for team
Add/edit employees (non-manager roles)
Manage department data

7.3. Super Admin
All Manager permissions
Full system access
Manage all users (including other managers and admins)
System-wide reports
IP management

8. API Endpoints
8.1 Authentication
POST /login - User authentication

8.2 Attendance
POST /check-in - Record check-in
POST /checkout - Record check-out
GET /last-checkinout - Get last check-in/out status
GET /active-checkin - Check for active session

8.3 User Management
GET /users - Get user list (Manager+)
POST /users - Create user (Manager+)
PUT /users - Update user (Manager+)
DELETE /users - Delete user (Manager+)

8.4 Departments
GET /departments - Get department list

8.5 Reports
GET /reports - Generate attendance reports

9.File Structure
 employee-checkin-system/
├── Backend/ (Controllers & Models mixed)
│   ├── api.php          
│   ├── auth.php         
│   ├── checkin.php      
│   ├── users.php        
│   ├── reports.php      
│   ├── config.php       
│   └── setup.php       
├── js/ (Client-side Controllers)
│   ├── core.js          
│   ├── attendance.js    
│   ├── manager.js       
│   ├── employee-management.js 
│   └── utils.js         
├── style/
│   └── styles.css       
├── (View Files)
│   ├── index.html               
│   ├── dashboard.html           
│   ├── dashboard-manager.html   
│   └── dashboard-super-admin.html 
└── schema.sql  (Database model)          

10. Usage
11. Security Features
12. Troubleshooting