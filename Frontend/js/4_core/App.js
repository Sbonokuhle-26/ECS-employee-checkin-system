// js/core/App.js
console.log('Loading App...');

if (typeof App === 'undefined') {
    class App {
        constructor() {
            console.log('Creating App instance...');
            
            // Initialize core services first
            this.initializeServices();
            
            // Check for required classes
            this.checkRequiredClasses();
            this.router = new Router();
            this.auth = new Auth();
            this.apiService = new ApiService();
            this.currentUser = null;
            
            // Setup dependencies
            this.auth.api = this.apiService;
            this.apiService.auth = this.auth;
            
            console.log('App instance created successfully');
        }

        initializeServices() {
            // Ensure basic services are available
            if (typeof StorageService === 'undefined') {
                console.error('StorageService not found');
            }
            if (typeof ValidationService === 'undefined') {
                console.error('ValidationService not found');
            }
            if (typeof Constants === 'undefined') {
                console.error('Constants not found');
            }
            if (typeof Helpers === 'undefined') {
                console.error('Helpers not found');
            }
        }

        checkRequiredClasses() {
            const requiredClasses = ['Router', 'Auth', 'ApiService'];
            const missingClasses = requiredClasses.filter(cls => {
                const exists = typeof window[cls] !== 'undefined';
                if (!exists) {
                    console.error(`Missing required class: ${cls}`);
                }
                return !exists;
            });
            
            if (missingClasses.length > 0) {
                throw new Error(`Missing required classes: ${missingClasses.join(', ')}`);
            }
        }

        
async init() {
    try {
        console.log('Initializing application...');
        
        // Check authentication with better error handling
        try {
            await this.auth.checkAuthStatus();
            this.currentUser = this.auth.currentUser;
            console.log('User authenticated:', this.currentUser?.fullName);
        } catch (authError) {
            console.log('No active session:', authError.message);
            this.currentUser = null;
        }
        
        // Simple routing logic - let the router handle everything
        await this.router.loadCurrentPage();
        
    } catch (error) {
        console.error('Application initialization failed:', error);
        this.showError('Application failed to initialize: ' + error.message);
        
        // Fallback: always show login on error
        window.location.href = 'index.html';
    }
}
async handlePageLoad() {
    const currentPage = this.router.getCurrentPage();
    console.log('Current page:', currentPage, 'User:', this.currentUser);
    
    // More robust routing logic
    if (this.currentUser) {
        console.log('User is authenticated, should stay on dashboard');
        if (currentPage === 'index.html') {
            console.log('Redirecting authenticated user from login to dashboard');
            this.router.navigateToDashboard();
            return;
        }
    } else {
        console.log('No user authenticated');
        if (currentPage !== 'index.html') {
            console.log('Redirecting unauthenticated user to login');
            this.router.navigateToLogin();
            return;
        }
    }
    
    // Load the page component only if we're on the correct page
    await this.router.loadCurrentPage();
}

        showError(message) {
            console.error('App Error:', message);
            // Simple error display
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #f8d7da;
                color: #721c24;
                padding: 15px;
                border: 1px solid #f5c6cb;
                border-radius: 5px;
                z-index: 10000;
                max-width: 400px;
            `;
            errorDiv.textContent = message;
            document.body.appendChild(errorDiv);
            
            setTimeout(() => {
                if (document.body.contains(errorDiv)) {
                    document.body.removeChild(errorDiv);
                }
            }, 5000);
        }
    }
    
    window.App = App;
    console.log(' App loaded and registered');
} else {
    console.log(' App already loaded');
}

// Safe initialization
function initializeApp() {
    try {
        console.log('Attempting to initialize application...');
        
        // Wait a bit for all classes to load
        setTimeout(() => {
            try {
                if (typeof App === 'undefined') {
                    throw new Error('App class not loaded');
                }
                
                if (typeof Router === 'undefined') {
                    throw new Error('Router class not loaded');
                }
                
                if (typeof ApiService === 'undefined') {
                    throw new Error('ApiService class not loaded');
                }
                
                window.employeeApp = new App();
                window.employeeApp.init().catch(error => {
                    console.error('App initialization error:', error);
                });
                
            } catch (error) {
                showInitializationError(error);
            }
        }, 100);
        
    } catch (error) {
        console.error('Failed to initialize application:', error);
        showInitializationError(error);
    }
}

function showInitializationError(error) {
    const errorMessage = document.createElement('div');
    errorMessage.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #dc3545;
        color: white;
        padding: 15px;
        text-align: center;
        z-index: 10000;
        font-family: Arial, sans-serif;
    `;
    errorMessage.innerHTML = `
        <strong>Application Error:</strong> ${error.message}
        <br><small>Please check the console for details and refresh the page.</small>
        <br><small>If the problem persists, check that all JavaScript files are loading correctly.</small>
    `;
    document.body.appendChild(errorMessage);
}

// Wait for DOM to be ready and all scripts to load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Wait a bit longer to ensure all scripts are loaded
        setTimeout(initializeApp, 200);
    });
} else {
    // DOM is already ready
    setTimeout(initializeApp, 200);
}