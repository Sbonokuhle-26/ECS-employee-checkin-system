class SuperAdminComponent extends ManagerComponent {
    constructor() {
        super();
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
                    <h1 style="margin: 0;">Super Admin Dashboard <span class="super-admin-badge" style="background: #ffc107; color: #000; padding: 2px 8px; border-radius: 12px; font-size: 0.8em; margin-left: 10px;">SUPER ADMIN</span></h1>
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
                            <button id="super-admin-checkin-btn" class="btn-primary" disabled>Check In</button>
                            <button id="super-admin-checkout-btn" class="btn-secondary" disabled>Check Out</button>
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
        // Update button IDs for super admin dashboard
        const logoutBtn = document.getElementById('super-admin-logout-btn');
        const checkinBtn = document.getElementById('super-admin-checkin-btn');
        const checkoutBtn = document.getElementById('super-admin-checkout-btn');
        
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

    async updateUserInfo() {
        const userNameElement = document.getElementById('super-admin-user-name');
        if (userNameElement && this.auth.currentUser) {
            userNameElement.textContent = this.auth.currentUser.fullName;
        }
    }

    displayEmployees() {
        const container = document.getElementById('users-list');
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

    addIpAddressField(ip = '', description = '') {
        const container = document.getElementById('user-ip-addresses');
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
        modal.style.display = 'none';
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
        ipContainer.innerHTML = '';
        
        if (employee.allowedIPs && employee.allowedIPs.length > 0) {
            employee.allowedIPs.forEach(ip => {
                this.addIpAddressField(ip.ip_address, ip.description);
            });
        } else {
            this.addIpAddressField('192.168.1.100', 'Main Office');
        }
    }

    clearUserForm() {
        document.getElementById('user-form').reset();
        document.getElementById('user-id').value = '';
        document.getElementById('user-role').value = 'employee';
        document.getElementById('user-status').value = 'active';
        
        // Clear IP addresses and add one default
        const ipContainer = document.getElementById('user-ip-addresses');
        ipContainer.innerHTML = '';
        this.addIpAddressField('192.168.1.100', 'Main Office');
    }

    async saveUser() {
        try {
            const userData = {
                first_name: document.getElementById('user-first-name').value.trim(),
                last_name: document.getElementById('user-last-name').value.trim(),
                email: document.getElementById('user-email').value.trim(),
                department_id: document.getElementById('user-department').value,
                role: document.getElementById('user-role').value,
                status: document.getElementById('user-status').value,
                allowed_ips: this.getIpAddresses()
            };

            const password = document.getElementById('user-password').value;
            if (password) {
                userData.password = password;
            }

            const userId = document.getElementById('user-id').value;
            if (userId) {
                userData.employee_id = userId;
            }

            // Validation
            const errors = ValidationService.validateUserData(userData, !!userId);
            const ipErrors = ValidationService.validateIPs(userData.allowed_ips);
            const allErrors = [...errors, ...ipErrors];
            
            if (allErrors.length > 0) {
                this.showMessage(allErrors.join(', '), Constants.MESSAGE_TYPES.ERROR);
                return;
            }

            // Prevent super admin from changing their own role
            if (userId && userId == this.auth.currentUser.id && userData.role !== 'super_admin') {
                this.showMessage('Super Admin cannot change their own role', Constants.MESSAGE_TYPES.ERROR);
                return;
            }

            const method = userId ? 'PUT' : 'POST';
            const response = await this.api[method.toLowerCase()](Constants.ENDPOINTS.USERS, userData);

            if (response.success) {
                this.hideUserModal();
                await this.loadEmployees();
                this.showMessage('User saved successfully!', Constants.MESSAGE_TYPES.SUCCESS);
            } else {
                this.showMessage(response.error, Constants.MESSAGE_TYPES.ERROR);
            }
        } catch (error) {
            console.error('Error saving user:', error);
            this.showMessage(`Error saving user: ${error.message}`, Constants.MESSAGE_TYPES.ERROR);
        }
    }

    async editEmployee(employeeId) {
        const employee = this.employees.find(emp => emp.id === employeeId);
        if (employee) {
            this.showUserModal(employee);
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
                this.showMessage('User deleted successfully!', Constants.MESSAGE_TYPES.SUCCESS);
            } else {
                this.showMessage(response.error, Constants.MESSAGE_TYPES.ERROR);
            }
        } catch (error) {
            this.showMessage(`Error deleting user: ${error.message}`, Constants.MESSAGE_TYPES.ERROR);
        }
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
