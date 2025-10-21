class SuperAdminComponent extends ManagerComponent {
    constructor() {
        super();
        this.employees = [];
        this.departments = [];
        this.currentCheckIn = null;
    }

    async render() {
        document.body.innerHTML = this.getTemplate();
        this.element = document.getElementById('super-admin-dashboard');
        this.bindEvents();
        await this.loadData();
    }

    getTemplate() {
        return `
            <div id="super-admin-dashboard" class="screen active">
                <header style="background: #dc3545; color: white; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center;">
                    <h1 style="margin: 0;">Super Admin Dashboard </h1>
                    <div class="user-info" style="display: flex; align-items: center; gap: 15px;">
                        <span id="super-admin-user-name">Loading...</span>
                        <button id="super-admin-logout-btn" style="background: #343a40; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">Logout</button>
                    </div>
                </header>
                
                <main style="padding: 20px; max-width: 1400px; margin: 0 auto;">
                    <!-- Super Admin's own check-in/out section -->
                    <div class="dashboard-section">
                        <h2>My Check-In/Check-Out</h2>
                        <div class="status-panel">
                            <p>Current Status: <span id="current-status">Loading...</span></p>
                            <p>Last Check-In: <span id="last-checkin">-</span></p>
                            <p>Last Check-Out: <span id="last-checkout">-</span></p>
                        </div>
                        <div class="action-buttons">
                            <button id="checkin-btn" class="btn-primary" disabled>Check In</button>
                            <button id="checkout-btn" class="btn-secondary" disabled>Check Out</button>
                        </div>
                        <div id="checkin-message" class="message"></div>
                    </div>
                    
                    <!-- User Management -->
                    <div class="dashboard-section">
                        <h2>User Management</h2>
                        <div class="action-buttons">
                            <button id="add-user-btn" class="btn-primary">Add New User</button>
                        </div>
                        
                        <!-- Add/Edit User Modal -->
                        <div id="user-modal" class="modal">
                            <div class="modal-content">
                                <span class="close">&times;</span>
                                <h3 id="modal-title">Add User</h3>
                                <form id="user-form">
                                    <input type="hidden" id="user-id">
                                    <div class="form-group">
                                        <label for="user-first-name">First Name:</label>
                                        <input type="text" id="user-first-name" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="user-last-name">Last Name:</label>
                                        <input type="text" id="user-last-name" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="user-email">Email:</label>
                                        <input type="email" id="user-email" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="user-password">Password:</label>
                                        <input type="password" id="user-password" placeholder="Leave blank to keep current">
                                    </div>
                                    <div class="form-group">
                                        <label for="user-department">Department:</label>
                                        <select id="user-department" required>
                                            <option value="">Select Department</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="user-role">Role:</label>
                                        <select id="user-role" required>
                                            <option value="employee">Employee</option>
                                            <option value="manager">Manager</option>
                                            <option value="super_admin">Super Admin</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="user-status">Status:</label>
                                        <select id="user-status" required>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label>Allowed IP Addresses:</label>
                                        <div id="user-ip-addresses">
                                            <div class="ip-field">
                                                <input type="text" placeholder="IP Address" class="ip-address" value="192.168.1.100">
                                                <input type="text" placeholder="Description (optional)" class="ip-description" value="Main Office">
                                                <button type="button" class="btn-remove-ip">×</button>
                                            </div>
                                        </div>
                                        <button type="button" id="add-ip-btn" class="btn-secondary">Add IP Address</button>
                                    </div>
                                    <div class="form-actions">
                                        <button type="submit" class="btn-primary">Save User</button>
                                        <button type="button" id="cancel-btn" class="btn-secondary">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        
                        <div id="users-list" class="table-container">
                            <div class="no-data">Loading users...</div>
                        </div>
                    </div>
                    
                    <!-- Reports -->
                    <div class="dashboard-section">
                        <h2>Reports</h2>
                        <div class="report-controls">
                            <div class="form-group">
                                <label for="report-start-date">Start Date:</label>
                                <input type="date" id="report-start-date">
                            </div>
                            <div class="form-group">
                                <label for="report-end-date">End Date:</label>
                                <input type="date" id="report-end-date">
                            </div>
                            <div class="form-group">
                                <label for="report-user">User:</label>
                                <select id="report-user">
                                    <option value="">All Users</option>
                                </select>
                            </div>
                            <div class="form-group" style="display: flex; align-items: flex-end; gap: 10px;">
                                <button id="generate-report-btn" class="btn-primary">Generate Report</button>
                                <button id="export-report-btn" class="btn-secondary">Export to CSV</button>
                            </div>
                        </div>
                        
                        <div id="report-results" class="table-container">
                            <div class="no-data">No report generated yet</div>
                        </div>
                    </div>
                    
                    <!-- Recent Activity -->
                    <div class="dashboard-section">
                        <h2>Recent Activity</h2>
                        <div id="recent-activity" class="activity-list">
                            <div class="no-data">Loading recent activity...</div>
                        </div>
                    </div>
                </main>
            </div>
        `;
    }

    bindEvents() {
        // Call parent bindEvents first
        super.bindEvents();

        // Update button IDs for super admin dashboard
        const logoutBtn = document.getElementById('super-admin-logout-btn');
        const checkinBtn = document.getElementById('checkin-btn');
        const checkoutBtn = document.getElementById('checkout-btn');
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.auth.logout();
            });
        }
        
        if (checkinBtn) {
            checkinBtn.addEventListener('click', () => this.handleCheckIn());
        }
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.handleCheckOut());
        }

        // Super admin specific events
        document.getElementById('add-user-btn')?.addEventListener('click', () => {
            this.showUserModal();
        });

        document.getElementById('user-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveUser();
        });

        document.getElementById('add-ip-btn')?.addEventListener('click', () => {
            this.addIpAddressField();
        });

        document.getElementById('generate-report-btn')?.addEventListener('click', () => {
            this.generateReport();
        });

        document.getElementById('export-report-btn')?.addEventListener('click', () => {
            this.exportReport();
        });

        document.querySelector('.close')?.addEventListener('click', () => {
            this.hideUserModal();
        });

        document.getElementById('cancel-btn')?.addEventListener('click', () => {
            this.hideUserModal();
        });

        // Set default report dates
        Helpers.setDefaultReportDates();

        // Bind IP remove buttons
        this.bindIpRemoveEvents();
    }

    async loadData() {
        await super.loadData();
        await this.loadEmployees();
        await this.loadDepartments();
        this.populateEmployeeFilter(); // Make sure this is called after employees are loaded
    }

    async updateUserInfo() {
        const userNameElement = document.getElementById('super-admin-user-name');
        if (userNameElement && this.auth.currentUser) {
            userNameElement.textContent = this.auth.currentUser.fullName;
        }
    }

    async loadEmployees() {
        try {
            console.log('Loading employees for super admin...');
            const response = await this.api.get(Constants.ENDPOINTS.USERS);
            console.log('Employees response:', response);
            
            if (response.success) {
                this.employees = response.data.map(emp => new User(emp));
                console.log('Employees loaded:', this.employees.length);
                this.displayEmployees();
                this.populateEmployeeFilter();
            } else {
                console.error('Failed to load employees:', response.error);
                this.showMessage('Failed to load employees: ' + (response.error || 'Unknown error'), 'error');
            }
        } catch (error) {
            console.error('Error loading employees:', error);
            this.showMessage('Failed to load employees: ' + error.message, 'error');
        }
    }

    async loadDepartments() {
        try {
            const response = await this.api.get(Constants.ENDPOINTS.DEPARTMENTS);
            if (response.success) {
                this.departments = response.data.map(dept => new Department(dept));
                this.populateDepartmentDropdown();
            }
        } catch (error) {
            console.error('Error loading departments:', error);
        }
    }

    displayEmployees() {
        const container = document.getElementById('users-list');
        if (!container) {
            console.error('Users list container not found');
            return;
        }

        let html = `
            <div class="table-responsive">
                <table class="employees-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Allowed IPs</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        if (this.employees.length === 0) {
            html += `<tr><td colspan="7" class="no-data">No users found</td></tr>`;
        } else {
            this.employees.forEach(employee => {
                const canEdit = this.auth.currentUser.canEdit(employee);
                const canDelete = this.auth.currentUser.canDelete(employee);
                const isCurrentUser = employee.id === this.auth.currentUser.id;
                const ipCount = employee.allowedIPs ? employee.allowedIPs.length : 0;

                html += `
                    <tr>
                        <td>${employee.fullName} ${isCurrentUser ? '<strong>(You)</strong>' : ''}</td>
                        <td>${employee.email}</td>
                        <td>${employee.departmentName || 'N/A'}</td>
                        <td><span class="role-badge role-${employee.role}">${employee.role}</span></td>
                        <td><span class="status-badge status-${employee.status}">${employee.status}</span></td>
                        <td>${ipCount} IP(s)</td>
                        <td>
                            ${canEdit ? `<button class="btn-edit" data-edit="${employee.id}">Edit</button>` : ''}
                            ${canDelete ? `<button class="btn-delete" data-delete="${employee.id}">Delete</button>` : ''}
                            ${!canEdit && !canDelete ? '<span style="color: #6c757d; font-style: italic;">No actions</span>' : ''}
                        </td>
                    </tr>
                `;
            });
        }

        html += `</tbody></table></div>`;
        container.innerHTML = html;

        // Add event listeners for action buttons
        this.bindEmployeeActionEvents();
    }

    bindEmployeeActionEvents() {
        // Edit buttons
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const employeeId = e.target.getAttribute('data-edit');
                this.editEmployee(parseInt(employeeId));
            });
        });

        // Delete buttons
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const employeeId = e.target.getAttribute('data-delete');
                this.deleteEmployee(parseInt(employeeId));
            });
        });
    }

    populateDepartmentDropdown() {
        const select = document.getElementById('user-department');
        if (!select) {
            console.error('Department dropdown not found');
            return;
        }

        select.innerHTML = '<option value="">Select Department</option>';
        this.departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.id;
            option.textContent = dept.name;
            select.appendChild(option);
        });
    }

    populateEmployeeFilter() {
    const select = document.getElementById('report-user');
    if (!select) {
        console.error('Report user dropdown not found');
        return;
    }

    console.log('Populating employee filter with', this.employees.length, 'employees');
    
    // Clear existing options except the first one
    select.innerHTML = '<option value="">All Users</option>';
    
    if (this.employees.length === 0) {
        console.warn('No employees to populate in filter');
        return;
    }

    this.employees.forEach(employee => {
        // Include ALL users (employees, managers, and super admins)
        const option = document.createElement('option');
        option.value = employee.id;
        option.textContent = employee.fullName + ` (${employee.role})`;
        select.appendChild(option);
    });

    console.log('Employee filter populated with', this.employees.length, 'users');
}

    addIpAddressField(ip = '', description = '') {
        const container = document.getElementById('user-ip-addresses');
        if (!container) {
            console.error('IP addresses container not found');
            return;
        }
        
        const field = document.createElement('div');
        field.className = 'ip-field';
        field.innerHTML = `
            <input type="text" placeholder="IP Address" value="${ip}" class="ip-address">
            <input type="text" placeholder="Description (optional)" value="${description}" class="ip-description">
            <button type="button" class="btn-remove-ip">×</button>
        `;
        container.appendChild(field);
        
        // Bind remove event to the new button
        field.querySelector('.btn-remove-ip').addEventListener('click', function() {
            field.remove();
        });
    }

    bindIpRemoveEvents() {
        document.querySelectorAll('.btn-remove-ip').forEach(btn => {
            btn.addEventListener('click', function() {
                this.parentElement.remove();
            });
        });
    }

    getIpAddresses() {
        const ipFields = document.querySelectorAll('#user-ip-addresses .ip-field');
        const ips = [];
        
        ipFields.forEach(field => {
            const ip = field.querySelector('.ip-address').value.trim();
            const description = field.querySelector('.ip-description').value.trim();
            
            if (ip) {
                if (!Helpers.isValidIP(ip)) {
                    throw new Error(`Invalid IP address: ${ip}`);
                }
                ips.push({
                    ip_address: ip,
                    description: description
                });
            }
        });
        
        return ips;
    }

    showUserModal(employee = null) {
        const modal = document.getElementById('user-modal');
        const title = document.getElementById('modal-title');
        const roleSelect = document.getElementById('user-role');

        if (!modal || !title) {
            console.error('User modal elements not found');
            return;
        }

        if (employee) {
            title.textContent = 'Edit User';
            this.populateUserForm(employee);
            
            // Disable role selection for self
            if (employee.id === this.auth.currentUser.id) {
                roleSelect.disabled = true;
            } else {
                roleSelect.disabled = false;
            }
        } else {
            title.textContent = 'Add User';
            this.clearUserForm();
            roleSelect.disabled = false;
        }

        modal.style.display = 'block';
    }

    hideUserModal() {
        const modal = document.getElementById('user-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    populateUserForm(employee) {
        document.getElementById('user-id').value = employee.id;
        document.getElementById('user-first-name').value = employee.firstName;
        document.getElementById('user-last-name').value = employee.lastName;
        document.getElementById('user-email').value = employee.email;
        document.getElementById('user-department').value = employee.departmentId;
        document.getElementById('user-role').value = employee.role;
        document.getElementById('user-status').value = employee.status;

        // Populate IP addresses
        const ipContainer = document.getElementById('user-ip-addresses');
        if (ipContainer) {
            ipContainer.innerHTML = '';
            
            if (employee.allowedIPs && employee.allowedIPs.length > 0) {
                employee.allowedIPs.forEach(ip => {
                    this.addIpAddressField(ip.ip_address, ip.description);
                });
            } else {
                this.addIpAddressField('192.168.1.100', 'Main Office');
            }
        }
    }

    clearUserForm() {
        const form = document.getElementById('user-form');
        if (form) {
            form.reset();
        }
        document.getElementById('user-id').value = '';
        document.getElementById('user-role').value = 'employee';
        document.getElementById('user-status').value = 'active';
        
        // Clear IP addresses and add one default
        const ipContainer = document.getElementById('user-ip-addresses');
        if (ipContainer) {
            ipContainer.innerHTML = '';
            this.addIpAddressField('192.168.1.100', 'Main Office');
        }
    }

    async saveUser() {
        try {
            const userData = {
                first_name: document.getElementById('user-first-name').value.trim(),
                last_name: document.getElementById('user-last-name').value.trim(),
                email: document.getElementById('user-email').value.trim(),
                department_id: document.getElementById('user-department').value,
                role: document.getElementById('user-role').value,
                status: document.getElementById('user-status').value
            };

            // Get IP addresses
            const ipFields = document.querySelectorAll('#user-ip-addresses .ip-field');
            userData.allowed_ips = [];
            
            ipFields.forEach(field => {
                const ip = field.querySelector('.ip-address').value.trim();
                const description = field.querySelector('.ip-description').value.trim();
                
                if (ip) {
                    if (!Helpers.isValidIP(ip)) {
                        throw new Error(`Invalid IP address: ${ip}`);
                    }
                    userData.allowed_ips.push({
                        ip_address: ip,
                        description: description
                    });
                }
            });

            const password = document.getElementById('user-password').value;
            if (password) {
                userData.password = password;
            }

            const userId = document.getElementById('user-id').value;
            if (userId) {
                userData.employee_id = userId;
            }

            // Validation
            if (!userData.first_name || !userData.last_name || !userData.email || !userData.department_id) {
                this.showMessage('Please fill all required fields', 'error');
                return;
            }

            if (userData.allowed_ips.length === 0) {
                this.showMessage('At least one valid IP address is required', 'error');
                return;
            }

            // Prevent super admin from changing their own role
            if (userId && userId == this.auth.currentUser.id && userData.role !== 'super_admin') {
                this.showMessage('Super Admin cannot change their own role', 'error');
                return;
            }

            const method = userId ? 'put' : 'post';
            const response = await this.api[method](Constants.ENDPOINTS.USERS, userData);

            if (response.success) {
                this.hideUserModal();
                await this.loadEmployees(); // This will reload employees and repopulate the filter
                this.showMessage('User saved successfully!', 'success');
            } else {
                this.showMessage(response.error || 'Failed to save user', 'error');
            }
        } catch (error) {
            console.error('Error saving user:', error);
            this.showMessage(`Error saving user: ${error.message}`, 'error');
        }
    }

    async editEmployee(employeeId) {
        const employee = this.employees.find(emp => emp.id === employeeId);
        if (employee) {
            this.showUserModal(employee);
        } else {
            this.showMessage('User not found', 'error');
        }
    }

    async deleteEmployee(employeeId) {
        const employee = this.employees.find(emp => emp.id === employeeId);
        if (!employee || !this.auth.currentUser.canDelete(employee)) {
            this.showMessage('You do not have permission to delete this user', 'error');
            return;
        }

        if (!confirm(`Are you sure you want to delete ${employee.fullName}? This action cannot be undone.`)) {
            return;
        }

        try {
            const response = await this.api.delete(Constants.ENDPOINTS.USERS, { employee_id: employeeId });

            if (response.success) {
                await this.loadEmployees(); // This will reload employees and repopulate the filter
                this.showMessage('User deleted successfully!', 'success');
            } else {
                this.showMessage(response.error || 'Failed to delete user', 'error');
            }
        } catch (error) {
            this.showMessage(`Error deleting user: ${error.message}`, 'error');
        }
    }

    async generateReport() {
        const startDate = document.getElementById('report-start-date')?.value;
        const endDate = document.getElementById('report-end-date')?.value;
        const employeeId = document.getElementById('report-user')?.value;

        if (!startDate || !endDate) {
            this.showMessage('Please select both start and end dates', 'error');
            return;
        }

        try {
            let url = `${Constants.ENDPOINTS.REPORTS}?start_date=${startDate}&end_date=${endDate}`;
            if (employeeId) {
                url += `&employee_id=${employeeId}`;
            }

            console.log('Generating report with URL:', url);
            const response = await this.api.get(url);

            if (response.success) {
                this.displayReportData(response.data);
                this.showMessage('Report generated successfully!', 'success');
            } else {
                this.showMessage(response.error || 'Failed to generate report', 'error');
            }
        } catch (error) {
            console.error('Report generation error:', error);
            this.showMessage(`Error generating report: ${error.message}`, 'error');
        }
    }

    displayReportData(data) {
        const container = document.getElementById('report-results');
        if (!container) {
            console.error('Report results container not found');
            return;
        }

        let html = `
            <div class="table-responsive">
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Department</th>
                            <th>Check-In Time</th>
                            <th>Check-Out Time</th>
                            <th>Hours Worked</th>
                            <th>IP Address</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        if (!data || data.length === 0) {
            html += `<tr><td colspan="7" class="no-data">No data found for the selected criteria</td></tr>`;
        } else {
            data.forEach(item => {
                const attendance = new Attendance(item);
                html += `
                    <tr>
                        <td>${attendance.employeeName}</td>
                        <td>${attendance.departmentName}</td>
                        <td>${attendance.checkInTimeFormatted}</td>
                        <td>${attendance.checkOutTimeFormatted}</td>
                        <td>${attendance.duration}</td>
                        <td>${attendance.ipAddress}</td>
                        <td>${attendance.location || 'N/A'}</td>
                    </tr>
                `;
            });
        }

        html += `</tbody></table></div>`;
        container.innerHTML = html;
    }

    exportReport() {
        const table = document.querySelector('.report-table');
        if (!table) {
            this.showMessage('No report data to export', 'error');
            return;
        }

        try {
            let csv = [];
            const rows = table.querySelectorAll('tr');
            
            for (let i = 0; i < rows.length; i++) {
                let row = [];
                const cols = rows[i].querySelectorAll('td, th');
                
                for (let j = 0; j < cols.length; j++) {
                    // Clean text and handle commas in data
                    const text = cols[j].innerText.replace(/"/g, '""');
                    row.push(`"${text}"`);
                }
                
                csv.push(row.join(','));
            }
            
            const csvString = csv.join('\n');
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            // Create filename with timestamp
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const filename = `attendance-report-${timestamp}.csv`;
            
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showMessage('Report exported successfully!', 'success');
        } catch (error) {
            console.error('Export error:', error);
            this.showMessage('Error exporting report: ' + error.message, 'error');
        }
    }

    async loadRecentActivity() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await this.api.get(`${Constants.ENDPOINTS.REPORTS}?start_date=${today}&end_date=${today}`);
            
            if (response.success) {
                this.displayRecentActivity(response.data);
            }
        } catch (error) {
            console.error('Error loading recent activity:', error);
            this.displayRecentActivity([]);
        }
    }

    displayRecentActivity(activities) {
    const container = document.getElementById('recent-activity');
    if (!container) return;

    container.innerHTML = '';

    if (!activities || activities.length === 0) {
        container.innerHTML = '<div class="no-data">No recent activity found.</div>';
        return;
    }

    // Show only last 10 activities for better overview
    activities.slice(0, 10).forEach(activity => {
        const attendance = new Attendance(activity);
        const item = document.createElement('div');
        item.className = 'activity-item';
        
        // Only show check-out time if available
        const checkoutDisplay = attendance.checkOutTime ? 
            ` - ${attendance.checkOutTimeFormatted}` : 
            ' (Active)';
            
        item.innerHTML = `
            <div class="activity-time">
                <strong>${attendance.employeeName}</strong> - ${attendance.departmentName}<br>
                ${attendance.checkInTimeFormatted}${checkoutDisplay}
            </div>
            <div class="activity-duration">${attendance.duration}</div>
        `;
        
        container.appendChild(item);
    });
}

    // Override parent methods to ensure they work correctly
    async handleCheckIn() {
        const checkinBtn = document.getElementById('checkin-btn');
        const originalText = checkinBtn.textContent;

        checkinBtn.textContent = 'Checking in...';
        checkinBtn.disabled = true;
        this.clearMessage('checkin-message');

        try {
            const clientIP = await Helpers.getClientIP();
            
            // Check if IP is allowed
            if (this.auth.currentUser.allowedIPs && this.auth.currentUser.allowedIPs.length > 0) {
                const isAllowed = this.auth.currentUser.allowedIPs.some(ipObj => ipObj.ip_address === clientIP);
                if (!isAllowed) {
                    this.showMessage(`Check-in not allowed from this IP address: ${clientIP}`, 'error', 'checkin-message');
                    checkinBtn.textContent = originalText;
                    checkinBtn.disabled = false;
                    return;
                }
            }

            const response = await this.api.post(Constants.ENDPOINTS.CHECK_IN, {
                employee_id: this.auth.currentUser.id,
                ip_address: clientIP,
                location: 'Office',
                device_fingerprint: Helpers.getDeviceFingerprint()
            });

            if (response.success) {
                this.currentCheckIn = response.checkin_id;
                this.updateCheckInUI();
                this.showMessage(response.message, 'success', 'checkin-message');
                await this.loadRecentActivity();
                await this.loadLastCheckInOut();
            } else {
                this.showMessage(response.error, 'error', 'checkin-message');
            }
        } catch (error) {
            console.error('Check-in error:', error);
            this.showMessage(`Check-in failed: ${error.message}`, 'error', 'checkin-message');
        } finally {
            checkinBtn.textContent = originalText;
            checkinBtn.disabled = false;
        }
    }

    async handleCheckOut() {
        const checkoutBtn = document.getElementById('checkout-btn');
        const originalText = checkoutBtn.textContent;

        checkoutBtn.textContent = 'Checking out...';
        checkoutBtn.disabled = true;
        this.clearMessage('checkin-message');

        try {
            const response = await this.api.post(Constants.ENDPOINTS.CHECK_OUT, {
                employee_id: this.auth.currentUser.id
            });

            if (response.success) {
                this.currentCheckIn = null;
                this.updateCheckInUI();
                this.showMessage(response.message, 'success', 'checkin-message');
                await this.loadRecentActivity();
                await this.loadLastCheckInOut();
            } else {
                this.showMessage(response.error, 'error', 'checkin-message');
            }
        } catch (error) {
            console.error('Check-out error:', error);
            this.showMessage(`Check-out failed: ${error.message}`, 'error', 'checkin-message');
        } finally {
            checkoutBtn.textContent = originalText;
            checkoutBtn.disabled = false;
        }
    }

    async updateCheckInStatus() {
        try {
            const response = await this.api.get(`${Constants.ENDPOINTS.ACTIVE_CHECKIN}?employee_id=${this.auth.currentUser.id}`);
            
            if (response.success) {
                this.currentCheckIn = response.has_active_checkin ? response.checkin : null;
                this.updateCheckInUI();
            }
        } catch (error) {
            console.error('Error updating check-in status:', error);
            this.showMessage('Error checking check-in status', 'error');
        }
    }

    updateCheckInUI() {
        const statusElement = document.getElementById('current-status');
        const checkinBtn = document.getElementById('checkin-btn');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (!statusElement || !checkinBtn || !checkoutBtn) return;

        if (this.currentCheckIn) {
            statusElement.textContent = 'Checked In';
            statusElement.className = 'status-checked-in';
            checkinBtn.disabled = true;
            checkoutBtn.disabled = false;
        } else {
            statusElement.textContent = 'Not Checked In';
            statusElement.className = 'status-not-checked-in';
            checkinBtn.disabled = false;
            checkoutBtn.disabled = true;
        }
    }

    async loadLastCheckInOut() {
        try {
            const response = await this.api.get(`${Constants.ENDPOINTS.LAST_CHECKINOUT}?employee_id=${this.auth.currentUser.id}`);
            
            if (response.success) {
                this.displayLastCheckInOut(response.data);
            }
        } catch (error) {
            console.error('Error loading last check-in/out:', error);
        }
    }

    displayLastCheckInOut(data) {
        const lastCheckinElement = document.getElementById('last-checkin');
        const lastCheckoutElement = document.getElementById('last-checkout');

        if (lastCheckinElement) {
            lastCheckinElement.textContent = data.last_checkin ? 
                Helpers.formatDate(data.last_checkin) : '-';
        }

        if (lastCheckoutElement) {
            lastCheckoutElement.textContent = data.last_checkout ? 
                Helpers.formatDate(data.last_checkout) : '-';
        }
    }

    showMessage(message, type = 'info', containerId = null) {
        Helpers.showMessage(message, type, containerId ? document.getElementById(containerId) : null);
    }

    clearMessage(containerId = null) {
        Helpers.clearMessage(containerId ? document.getElementById(containerId) : null);
    }

    destroy() {
        // Remove any additional event listeners specific to super admin
        const addUserBtn = document.getElementById('add-user-btn');
        const addIpBtn = document.getElementById('add-ip-btn');
        const exportBtn = document.getElementById('export-report-btn');

        if (addUserBtn) {
            addUserBtn.removeEventListener('click', () => {});
        }
        if (addIpBtn) {
            addIpBtn.removeEventListener('click', () => {});
        }
        if (exportBtn) {
            exportBtn.removeEventListener('click', () => {});
        }

        // Remove IP remove event listeners
        document.querySelectorAll('.btn-remove-ip').forEach(btn => {
            btn.removeEventListener('click', () => {});
        });

        super.destroy();
    }
}