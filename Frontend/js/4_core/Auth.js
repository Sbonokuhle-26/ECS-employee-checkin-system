// Auth.js
console.log('Loading Auth...');

if (typeof Auth === 'undefined') {
    class Auth {
        constructor() {
            console.log('Creating Auth instance...');
            this.currentUser = null;
            this.token = null;
        }

        get storage() {
            if (typeof StorageService === 'undefined') {
                throw new Error('StorageService not available');
            }
            return new StorageService();
        }

        get api() {
            if (typeof ApiService === 'undefined') {
                throw new Error('ApiService not available');
            }
            if (!this._api) {
                this._api = new ApiService();
            }
            return this._api;
        }

        set api(apiService) {
            this._api = apiService;
        }

        async login(email, password) {
            try {
                console.log('Attempting login for:', email);
                
                const response = await this.api.post('login', {
                    email: email,
                    password: password
                });

                if (response.success) {
                    this.currentUser = new User(response.user);
                    this.token = response.token;
                    
                    // Store session data
                    this.storage.setItem('userToken', this.token);
                    this.storage.setItem('currentUser', JSON.stringify(response.user));
                    
                    console.log('Login successful for user:', this.currentUser.fullName);
                    
                    return {
                        success: true,
                        user: this.currentUser,
                        redirectUrl: response.redirect_url
                    };
                } else {
                    throw new Error(response.error || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                throw error;
            }
        }

       logout() {
    console.log('Logging out user');
    
    // Clear current state
    this.currentUser = null;
    this.token = null;
    
    // Clear storage
    this.storage.removeItem('userToken');
    this.storage.removeItem('currentUser');
    
    console.log('Auth state cleared, redirecting to login...');
    
    // Use location.replace to avoid history issues
    setTimeout(() => {
        window.location.replace('index.html');
    }, 100);
}

        // js/core/Auth.js - Updated checkAuthStatus method
async checkAuthStatus() {
    const token = this.storage.getItem('userToken');
    const userData = this.storage.getItem('currentUser');

    console.log('Auth check - Token exists:', !!token, 'User data exists:', !!userData);

    if (!token || !userData) {
        console.log('No active session found - missing token or user data');
        throw new Error('No active session found');
    }

    try {
        // Verify token structure
        let tokenData;
        try {
            tokenData = JSON.parse(atob(token));
        } catch (parseError) {
            console.error('Token parsing failed:', parseError);
            this.logout();
            throw new Error('Invalid token format');
        }

        const currentTime = Math.floor(Date.now() / 1000);

        if (tokenData.exp && tokenData.exp < currentTime) {
            console.log('Token expired');
            this.logout();
            throw new Error('Session expired');
        }

        // Parse user data
        let user;
        try {
            user = JSON.parse(userData);
        } catch (userParseError) {
            console.error('User data parsing failed:', userParseError);
            this.logout();
            throw new Error('Invalid user data');
        }

        this.token = token;
        this.currentUser = new User(user);

        console.log('User authenticated successfully:', this.currentUser.fullName);
        return this.currentUser;
    } catch (error) {
        console.error('Auth check error:', error);
        this.logout();
        throw error;
    }
}

        isAuthenticated() {
            return this.currentUser !== null && this.token !== null;
        }
    }
    
    window.Auth = Auth;
    console.log('✓ Auth loaded and registered');
} else {
    console.log('✓ Auth already loaded');
}