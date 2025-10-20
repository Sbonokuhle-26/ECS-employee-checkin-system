
class DashboardComponent extends BaseComponent {
    constructor() {
        super();
        this.currentCheckIn = null;
        this.recentActivity = [];
    }

    async render() {
        document.body.innerHTML = this.getTemplate();
        this.element = document.getElementById('employee-dashboard');
        this.bindEvents();
        await this.loadData();
    }

    getTemplate() {
        return `
            <div id="employee-dashboard" class="screen active">
                <header style="background: #007bff; color: white; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center;">
                    <h1 style="margin: 0;">Employee Dashboard</h1>
                    <div class="user-info" style="display: flex; align-items: center; gap: 15px;">
                        <span id="user-name">Loading...</span>
                        <button id="logout-btn" style="background: #dc3545; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">Logout</button>
                    </div>
                </header>
                
                <main style="padding: 20px; max-width: 1000px; margin: 0 auto;">
                    <div class="dashboard-section">
                        <h2>Check-In/Check-Out</h2>
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
        const logoutBtn = document.getElementById('logout-btn');
        const checkinBtn = document.getElementById('checkin-btn');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.auth.logout();
            });
        }

        if (checkinBtn) {
            checkinBtn.addEventListener('click', () => {
                this.handleCheckIn();
            });
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.handleCheckOut();
            });
        }
    }

    async loadData() {
        try {
            await this.updateUserInfo();
            await this.updateCheckInStatus();
            await this.loadLastCheckInOut();
            await this.loadRecentActivity();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showMessage('Error loading dashboard data', 'error');
        }
    }

    async updateUserInfo() {
        const userNameElement = document.getElementById('user-name');
        if (userNameElement && this.auth.currentUser) {
            userNameElement.textContent = this.auth.currentUser.fullName;
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

    async loadRecentActivity() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await this.api.get(`${Constants.ENDPOINTS.REPORTS}?start_date=${today}&employee_id=${this.auth.currentUser.id}`);
            
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
                    <strong>${attendance.checkInTimeFormatted}</strong> - ${attendance.checkOutTimeFormatted}
                </div>
                <div class="activity-duration">${attendance.duration}</div>
            `;
            
            container.appendChild(item);
        });
    }

    showMessage(message, type = 'info', containerId = null) {
        Helpers.showMessage(message, type, containerId ? document.getElementById(containerId) : null);
    }

    clearMessage(containerId = null) {
        Helpers.clearMessage(containerId ? document.getElementById(containerId) : null);
    }

    destroy() {
        // Remove event listeners
        const logoutBtn = document.getElementById('logout-btn');
        const checkinBtn = document.getElementById('checkin-btn');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (logoutBtn) {
            logoutBtn.removeEventListener('click', () => {});
        }
        if (checkinBtn) {
            checkinBtn.removeEventListener('click', () => {});
        }
        if (checkoutBtn) {
            checkoutBtn.removeEventListener('click', () => {});
        }

        super.destroy();
    }
}
