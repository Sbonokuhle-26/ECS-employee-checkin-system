class ManagerComponent extends DashboardComponent {
    constructor() {
        super();
        this.employees = [];
        this.departments = [];
    }

    async render() {
        document.body.innerHTML = this.getTemplate();
        this.element = document.getElementById('manager-dashboard');
        this.bindEvents();
        await this.loadData();
    }

    getTemplate() {
        return `
            <div id="manager-dashboard" class="screen active">
                <header style="background: #343a40; color: white; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center;">
                    <h1 style="margin: 0;">Manager Dashboard</h1>
                    <div class="user-info" style="display: flex; align-items: center; gap: 15px;">
                        <span id="manager-user-name">Loading...</span>
                        <button id="manager-logout-btn" style="background: #dc3545; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">Logout</button>
                    </div>
                </header>
                
                <main style="padding: 20px; max-width: 1200px; margin: 0 auto;">
                    <!-- Manager's own check-in/out section -->
                    <div class="dashboard-section">
                        <h2>My Check-In/Check-Out</h2>
                        <div class="status-panel">
                            <p>Current Status: <span id="current-status">Loading...</span></p>
                            <p>Last Check-In: <span id="last-checkin">-</span></p>
                            <p>Last Check-Out: <span id="last-checkout">-</span></p>
                        </div>
                        <div class="action-buttons">
                            <button id="manager-checkin-btn" class="btn-primary" disabled>Check In</button>
                            <button id="manager-checkout-btn" class="btn-secondary" disabled>Check Out</button>
                        </div>
                        <div id="checkin-message" class="message"></div>
                    </div>
                    
                    <!-- Employee Management -->
                    <div class="dashboard-section">
                        <h2>Employee Management</h2>
                        <div class="action-buttons">
                            <button id="add-employee-btn" class="btn-primary">Add New Employee</button>
                        </div>
                        
                        <!-- Add/Edit Employee Modal -->
                        <div id="employee-modal" class="modal">
                            <div class="modal-content">
                                <span class="close">&times;</span>
                                <h3 id="modal-title">Add Employee</h3>
                                <form id="employee-form">
                                    <input type="hidden" id="employee-id">
                                    <div class="form-group">
                                        <label for="first-name">First Name:</label>
                                        <input type="text" id="first-name" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="last-name">Last Name:</label>
                                        <input type="text" id="last-name" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="email">Email:</label>
                                        <input type="email" id="email" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="password">Password:</label>
                                        <input type="password" id="password" placeholder="Leave blank to keep current">
                                    </div>
                                    <div class="form-group">
                                        <label for="department">Department:</label>
                                        <select id="department" required>
                                            <option value="">Select Department</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="role">Role:</label>
                                        <select id="role" required>
                                            <option value="employee">Employee</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="status">Status:</label>
                                        <select id="status" required>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div class="form-actions">
                                        <button type="submit" class="btn-primary">Save Employee</button>
                                        <button type="button" id="cancel-btn" class="btn-secondary">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        
                        <div id="employees-list" class="table-container">
                            <div class="no-data">Loading employees...</div>
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
                                <label for="report-employee">Employee:</label>
                                <select id="report-employee">
                                    <option value="">All Employees</option>
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

        // Update button IDs for manager dashboard
        const logoutBtn = document.getElementById('manager-logout-btn');
        const checkinBtn = document.getElementById('manager-checkin-btn');
        const checkoutBtn = document.getElementById('manager-checkout-btn');
        
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

        // Manager specific events
        document.getElementById('add-employee-btn')?.addEventListener('click', () => {
            this.showEmployeeModal();
        });

        document.getElementById('employee-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEmployee();
        });

        document.getElementById('generate-report-btn')?.addEventListener('click', () => {
            this.generateReport();
        });

        document.getElementById('export-report-btn')?.addEventListener('click', () => {
            this.exportReport();
        });

        document.querySelector('.close')?.addEventListener('click', () => {
            this.hideEmployeeModal();
        });

        document.getElementById('cancel-btn')?.addEventListener('click', () => {
            this.hideEmployeeModal();
        });

        // Set default report dates
        Helpers.setDefaultReportDates();
    }

    async loadData() {
        await super.loadData();
        await this.loadEmployees();
        await this.loadDepartments();
    }

    async updateUserInfo() {
        const userNameElement = document.getElementById('manager-user-name');
        if (userNameElement && this.auth.currentUser) {
            userNameElement.textContent = this.auth.currentUser.fullName;
        }
    }

    async loadEmployees() {
        try {
            const response = await this.api.get(Constants.ENDPOINTS.USERS);
            if (response.success) {
                this.employees = response.data.map(emp => new User(emp));
                this.displayEmployees();
                this.populateEmployeeFilter();
            }
        } catch (error) {
            console.error('Error loading employees:', error);
            this.showMessage('Failed to load employees', error);
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
        const container = document.getElementById('employees-list');
        if (!container) return;

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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        if (this.employees.length === 0) {
            html += `<tr><td colspan="6" class="no-data">No employees found</td></tr>`;
        } else {
            this.employees.forEach(employee => {
                const canEdit = this.auth.currentUser.canEdit(employee);
                const canDelete = this.auth.currentUser.canDelete(employee);
                const isCurrentUser = employee.id === this.auth.currentUser.id;

                html += `
                    <tr>
                        <td>${employee.fullName} ${isCurrentUser ? '<strong>(You)</strong>' : ''}</td>
                        <td>${employee.email}</td>
                        <td>${employee.departmentName || 'N/A'}</td>
                        <td><span class="role-badge role-${employee.role}">${employee.role}</span></td>
                        <td><span class="status-badge status-${employee.status}">${employee.status}</span></td>
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
        const select = document.getElementById('department');
        if (!select) return;

        select.innerHTML = '<option value="">Select Department</option>';
        this.departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.id;
            option.textContent = dept.name;
            select.appendChild(option);
        });
    }

    populateEmployeeFilter() {
        const select = document.getElementById('report-employee');
        if (!select) return;

        select.innerHTML = '<option value="">All Employees</option>';
        this.employees.forEach(employee => {
            const option = document.createElement('option');
            option.value = employee.id;
            option.textContent = employee.fullName;
            select.appendChild(option);
        });
    }

    showEmployeeModal(employee = null) {
        const modal = document.getElementById('employee-modal');
        const title = document.getElementById('modal-title');
        const roleSelect = document.getElementById('role');

        if (employee) {
            title.textContent = 'Edit Employee';
            this.populateEmployeeForm(employee);
            
            // Managers cannot edit roles to manager
            if (employee.role === 'manager' && employee.id !== this.auth.currentUser.id) {
                roleSelect.disabled = true;
            } else {
                roleSelect.disabled = false;
            }
        } else {
            title.textContent = 'Add Employee';
            this.clearEmployeeForm();
            roleSelect.disabled = false;
        }

        modal.style.display = 'block';
    }

    hideEmployeeModal() {
        const modal = document.getElementById('employee-modal');
        modal.style.display = 'none';
    }

    populateEmployeeForm(employee) {
        document.getElementById('employee-id').value = employee.id;
        document.getElementById('first-name').value = employee.firstName;
        document.getElementById('last-name').value = employee.lastName;
        document.getElementById('email').value = employee.email;
        document.getElementById('department').value = employee.departmentId;
        document.getElementById('role').value = employee.role;
        document.getElementById('status').value = employee.status;
    }

    clearEmployeeForm() {
        document.getElementById('employee-form').reset();
        document.getElementById('employee-id').value = '';
        document.getElementById('role').value = 'employee';
        document.getElementById('status').value = 'active';
    }

    async saveEmployee() {
        const employeeData = {
            first_name: document.getElementById('first-name').value.trim(),
            last_name: document.getElementById('last-name').value.trim(),
            email: document.getElementById('email').value.trim(),
            department_id: document.getElementById('department').value,
            role: document.getElementById('role').value,
            status: document.getElementById('status').value
        };

        const password = document.getElementById('password').value;
        if (password) {
            employeeData.password = password;
        }

        const employeeId = document.getElementById('employee-id').value;
        if (employeeId) {
            employeeData.employee_id = employeeId;
        }

        // Validation
        const errors = ValidationService.validateUserData(employeeData, !!employeeId);
        if (errors.length > 0) {
            this.showMessage(errors.join(', '), Constants.MESSAGE_TYPES.ERROR);
            return;
        }

        // Managers cannot create managers
        if (employeeData.role === 'manager' && this.auth.currentUser.role === 'manager') {
            this.showMessage('Managers cannot create other managers', Constants.MESSAGE_TYPES.ERROR);
            return;
        }

        try {
            const method = employeeId ? 'PUT' : 'POST';
            const response = await this.api[method.toLowerCase()](Constants.ENDPOINTS.USERS, employeeData);

            if (response.success) {
                this.hideEmployeeModal();
                await this.loadEmployees();
                this.showMessage('Employee saved successfully!', success);
            } else {
                this.showMessage(response.error, Constants.MESSAGE_TYPES.ERROR);
            }
        } catch (error) {
            this.showMessage(`Error saving employee: ${error.message}`, Constants.MESSAGE_TYPES.ERROR);
        }
    }

    async editEmployee(employeeId) {
        const employee = this.employees.find(emp => emp.id === employeeId);
        if (employee && this.auth.currentUser.canEdit(employee)) {
            this.showEmployeeModal(employee);
        } else {
            this.showMessage('You do not have permission to edit this employee', Constants.MESSAGE_TYPES.ERROR);
        }
    }

    async deleteEmployee(employeeId) {
        const employee = this.employees.find(emp => emp.id === employeeId);
        if (!employee || !this.auth.currentUser.canDelete(employee)) {
            this.showMessage('You do not have permission to delete this employee', Constants.MESSAGE_TYPES.ERROR);
            return;
        }

        if (!confirm(`Are you sure you want to delete ${employee.fullName}? This action cannot be undone.`)) {
            return;
        }

        try {
            const response = await this.api.delete(Constants.ENDPOINTS.USERS, { employee_id: employeeId });

            if (response.success) {
                await this.loadEmployees();
                this.showMessage('Employee deleted successfully!', Constants.MESSAGE_TYPES.SUCCESS);
            } else {
                this.showMessage(response.error, Constants.MESSAGE_TYPES.ERROR);
            }
        } catch (error) {
            this.showMessage(`Error deleting employee: ${error.message}`, Constants.MESSAGE_TYPES.ERROR);
        }
    }

    async generateReport() {
        const startDate = document.getElementById('report-start-date')?.value;
        const endDate = document.getElementById('report-end-date')?.value;
        const employeeId = document.getElementById('report-employee')?.value;

        if (!startDate || !endDate) {
            this.showMessage('Please select both start and end dates', Constants.MESSAGE_TYPES.ERROR);
            return;
        }

        try {
            const params = new URLSearchParams();
            params.append('start_date', startDate);
            params.append('end_date', endDate);
            if (employeeId) params.append('employee_id', employeeId);

            const response = await this.api.get(`${Constants.ENDPOINTS.REPORTS}?${params.toString()}`);

            if (response.success) {
                this.displayReportData(response.data);
                this.showMessage('Report generated successfully!', Constants.MESSAGE_TYPES.SUCCESS);
            } else {
                this.showMessage(response.error, Constants.MESSAGE_TYPES.ERROR);
            }
        } catch (error) {
            this.showMessage(`Error generating report: ${error.message}`, Constants.MESSAGE_TYPES.ERROR);
        }
    }

    displayReportData(data) {
        const container = document.getElementById('report-results');
        if (!container) return;

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
                        </tr>
                    </thead>
                    <tbody>
        `;

        if (!data || data.length === 0) {
            html += `<tr><td colspan="6" class="no-data">No data found for the selected criteria</td></tr>`;
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
            this.showMessage('No report data to export', Constants.MESSAGE_TYPES.ERROR);
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
            
            this.showMessage('Report exported successfully!', Constants.MESSAGE_TYPES.SUCCESS);
        } catch (error) {
            console.error('Export error:', error);
            this.showMessage('Error exporting report', Constants.MESSAGE_TYPES.ERROR);
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

        // Show only last 5 activities
        activities.slice(0, 5).forEach(activity => {
            const attendance = new Attendance(activity);
            const item = document.createElement('div');
            item.className = 'activity-item';
            
            item.innerHTML = `
                <div class="activity-time">
                    <strong>${attendance.employeeName}</strong><br>
                    ${attendance.checkInTimeFormatted} - ${attendance.checkOutTimeFormatted}
                </div>
                <div class="activity-duration">${attendance.duration}</div>
            `;
            
            container.appendChild(item);
        });
    }

    destroy() {
        // Remove any additional event listeners
        const addEmployeeBtn = document.getElementById('add-employee-btn');
        const generateReportBtn = document.getElementById('generate-report-btn');
        const exportReportBtn = document.getElementById('export-report-btn');

        if (addEmployeeBtn) {
            addEmployeeBtn.removeEventListener('click', () => {});
        }
        if (generateReportBtn) {
            generateReportBtn.removeEventListener('click', () => {});
        }
        if (exportReportBtn) {
            exportReportBtn.removeEventListener('click', () => {});
        }

        super.destroy();
    }
}
