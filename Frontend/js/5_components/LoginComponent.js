class LoginComponent extends BaseComponent {
    constructor() {
        super();
        this.form = null;
    }

    async render() {
        // Only render if we're on the login page
        const currentPage = this.app.router.getCurrentPage();
        if (currentPage !== 'index.html') {
            return;
        }

        document.body.innerHTML = this.getTemplate();
        this.element = document.getElementById('login-screen');
        this.bindEvents();
        
        // Auto-focus email field
        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.focus();
        }
    }

    getTemplate() {
        return `
            <div id="login-screen" class="screen active">
                <div class="login-container">
                    <div class="login-header">
                        <h1>Employee Check-In System</h1>
                    </div>
                    <form id="login-form">
                        <div class="form-group">
                            <label for="email">Email:</label>
                            <input type="email" id="email" name="email" required autocomplete="email">
                        </div>
                        <div class="form-group">
                            <label for="password">Password:</label>
                            <input type="password" id="password" name="password" required autocomplete="current-password">
                        </div>
                        <button type="submit" id="login-btn" class="btn-primary">Login</button>
                    </form>
                   
                </div>
            </div>
        `;
    }

    bindEvents() {
        this.form = document.getElementById('login-form');
        if (this.form) {
            this.form.addEventListener('submit', this.handleLogin.bind(this));
        }

        // Add input event listeners for real-time validation
        const emailField = document.getElementById('email');
        const passwordField = document.getElementById('password');
        
        if (emailField) {
            emailField.addEventListener('input', this.clearValidation.bind(this));
        }
        if (passwordField) {
            passwordField.addEventListener('input', this.clearValidation.bind(this));
        }
    }

    clearValidation() {
        this.clearMessage('login-message');
    }

   
async handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('login-btn');
    const messageDiv = document.getElementById('login-message');

    // Basic validation
    if (!email || !password) {
        this.showMessage('Please enter both email and password', Constants.MESSAGE_TYPES.ERROR, 'login-message');
        return;
    }

    if (!Helpers.isValidEmail(email)) {
        this.showMessage('Please enter a valid email address', Constants.MESSAGE_TYPES.ERROR, 'login-message');
        return;
    }

    // Update UI
    loginBtn.textContent = 'Logging in...';
    loginBtn.disabled = true;
    this.clearMessage('login-message');

    try {
        const result = await this.auth.login(email, password);
        
        if (result.success) {
            this.showMessage('Login successful! Redirecting...', Constants.MESSAGE_TYPES.SUCCESS, 'login-message');
            
            // Use a simple redirect without relying on the router
            setTimeout(() => {
                console.log('Redirecting to:', result.redirectUrl);
                window.location.href = result.redirectUrl;
            }, 500);
        }
    } catch (error) {
        console.error('Login error:', error);
        this.showMessage(error.message, Constants.MESSAGE_TYPES.ERROR, 'login-message');
        
        // Re-enable button on error
        loginBtn.textContent = 'Login';
        loginBtn.disabled = false;
    }
}

    destroy() {
        if (this.form) {
            this.form.removeEventListener('submit', this.handleLogin);
        }
        super.destroy();
    }
}