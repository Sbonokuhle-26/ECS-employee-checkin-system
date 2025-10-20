// js/core/Router.js
console.log('Loading Router...');

if (typeof Router === 'undefined') {
    class Router {
        constructor() {
            console.log('Creating Router instance...');
            this.currentComponent = null;
            this.isInitialized = false;
        }

        getCurrentPage() {
            const path = window.location.pathname;
            const page = path.split('/').pop();
            console.log('Current page detected:', page);
            return page || 'index.html';
        }

        navigateToDashboard() {
            const user = window.employeeApp?.auth?.currentUser;
            if (!user) {
                console.warn('No user found when trying to navigate to dashboard');
                this.navigateToLogin();
                return;
            }

            let dashboardPage = 'dashboard.html';
            if (user.role === 'super_admin') {
                dashboardPage = 'dashboard-super-admin.html';
            } else if (user.role === 'manager') {
                dashboardPage = 'dashboard-manager.html';
            }

            console.log('Navigating to:', dashboardPage);
            
            // Use replace to avoid adding to history stack
            if (this.getCurrentPage() !== dashboardPage) {
                window.location.replace(dashboardPage);
            } else {
                console.log('Already on correct dashboard page');
            }
        }

        navigateToLogin() {
            console.log('Navigating to login');
            if (this.getCurrentPage() !== 'index.html') {
                window.location.replace('index.html');
            }
        }

        async loadCurrentPage() {
    try {
        const currentPage = this.getCurrentPage();
        console.log('Loading page component for:', currentPage);

        // Get user from auth service directly
        const user = window.employeeApp?.auth?.currentUser;
        console.log('Router user state:', user ? `${user.fullName} (${user.role})` : 'No user');

        // Check if we're already on the correct page to avoid infinite loops
        if (user) {
            // User is authenticated - should be on dashboard
            if (currentPage === 'index.html') {
                console.log('Redirecting authenticated user from login to dashboard');
                this.navigateToDashboard();
                return; // Stop execution here
            }
        } else {
            // User is not authenticated - should be on login
            if (currentPage !== 'index.html') {
                console.log('Redirecting unauthenticated user to login');
                this.navigateToLogin();
                return; // Stop execution here
            }
        }

        // Only load component if we're on the correct page
        console.log('On correct page, loading component...');

        // Destroy current component if exists
        if (this.currentComponent) {
            console.log('Destroying current component');
            this.currentComponent.destroy();
            this.currentComponent = null;
        }

        // Load appropriate component based on page
        let component = null;
        
        switch (currentPage) {
            case 'index.html':
                component = new LoginComponent();
                break;
            case 'dashboard.html':
                component = new DashboardComponent();
                break;
            case 'dashboard-manager.html':
                component = new ManagerComponent();
                break;
            case 'dashboard-super-admin.html':
                component = new SuperAdminComponent();
                break;
            default:
                console.warn('Unknown page:', currentPage);
                // Redirect to appropriate page
                if (user) {
                    this.navigateToDashboard();
                } else {
                    this.navigateToLogin();
                }
                return;
        }

        // Render the component
        if (component) {
            console.log('Rendering component:', component.constructor.name);
            this.currentComponent = component;
            await this.currentComponent.render();
            console.log('Component rendered successfully');
        }

        this.isInitialized = true;

    } catch (error) {
        console.error('Error loading page:', error);
        this.showError('Failed to load page: ' + error.message);
    }
}

        showError(message) {
            console.error('Router Error:', message);
            
            // Remove any existing error messages
            const existingErrors = document.querySelectorAll('.router-error-message');
            existingErrors.forEach(error => error.remove());
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'router-error-message';
            errorDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background:#f8d7da;
                color: #721c24;
                padding: 15px;
                border: 1px solid #f5c6cb;
                border-radius: 5px;
                z-index: 10000;
                max-width: 400px;
                font-family: Arial, sans-serif;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            `;
            errorDiv.innerHTML = `
                <strong>Routing Error</strong><br>
                ${message}
            `;
            document.body.appendChild(errorDiv);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (document.body.contains(errorDiv)) {
                    document.body.removeChild(errorDiv);
                }
            }, 5000);
        }

        showSuccess(message) {
            console.log('Router Success:', message);
            
            const successDiv = document.createElement('div');
            successDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #d4edda;
                color: #155724;
                padding: 15px;
                border: 1px solid #c3e6cb;
                border-radius: 5px;
                z-index: 10000;
                max-width: 400px;
                font-family: Arial, sans-serif;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            `;
            successDiv.innerHTML = `
                <strong>Success</strong><br>
                ${message}
            `;
            document.body.appendChild(successDiv);
            
            setTimeout(() => {
                if (document.body.contains(successDiv)) {
                    document.body.removeChild(successDiv);
                }
            }, 3000);
        }

        // Method to manually trigger page reload (useful for auth changes)
        async reloadCurrentPage() {
            console.log(' Manually reloading current page');
            await this.loadCurrentPage();
        }

        // Cleanup method
        destroy() {
            if (this.currentComponent) {
                this.currentComponent.destroy();
                this.currentComponent = null;
            }
            this.isInitialized = false;
            console.log(' Router destroyed');
        }

        // Get current component info (for debugging)
        getCurrentComponentInfo() {
            return this.currentComponent ? {
                name: this.currentComponent.constructor.name,
                element: this.currentComponent.element
            } : null;
        }
    }
    
    window.Router = Router;
    console.log(' Router loaded and registered');
} else {
    console.log(' Router already loaded');
}