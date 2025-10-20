// js/services/ApiService.js
console.log('Loading ApiService...');

if (typeof ApiService === 'undefined') {
    class ApiService {
        constructor() {
            console.log('Creating ApiService instance...');
            this.baseURL = this.determineBaseURL();
            this.auth = null;
            console.log('ApiService initialized with baseURL:', this.baseURL);
        }

        determineBaseURL() {
            const currentPath = window.location.pathname;
            console.log('Current path:', currentPath);
            
            // Check if we're in the frontend directory
            if (currentPath.includes('/Frontend/') || currentPath.includes('/frontend/')) {
                return window.location.origin + '/employee-checkin-system/Backend/api.php/';
            } else {
                return window.location.origin + '/Backend/api.php/';
            }
        }

        async request(endpoint, options = {}) {
            const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
            const url = this.baseURL + cleanEndpoint;
            
            console.log('API Request:', url, options.method || 'GET');

            const config = {
                method: options.method || 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            };

            // Add authorization header if available
            if (this.auth?.token) {
                config.headers['Authorization'] = `Bearer ${this.auth.token}`;
            }

            // Add body for methods that support it
            if (options.body) {
                config.body = options.body;
            }

            try {
                const response = await fetch(url, config);
                console.log('API Response Status:', response.status);
                
                if (response.status === 401) {
                    if (this.auth) {
                        this.auth.logout();
                    }
                    throw new Error('Session expired. Please login again.');
                }

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('API Error Response:', errorText);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const text = await response.text();
                
                if (!text) {
                    return { success: true };
                }

                const data = JSON.parse(text);
                console.log('API Response Data:', data);
                return data;
                
            } catch (error) {
                console.error('API request failed:', error);
                
                if (error.message.includes('Failed to fetch')) {
                    throw new Error('Cannot connect to server. Please check if the backend is running.');
                }
                
                throw error;
            }
        }

        async get(endpoint) {
            return this.request(endpoint, { method: 'GET' });
        }

        async post(endpoint, data) {
            return this.request(endpoint, {
                method: 'POST',
                body: JSON.stringify(data)
            });
        }

        async put(endpoint, data) {
            return this.request(endpoint, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        }

        async delete(endpoint, data = null) {
            const options = { method: 'DELETE' };
            if (data) {
                options.body = JSON.stringify(data);
            }
            return this.request(endpoint, options);
        }
    }
    
    window.ApiService = ApiService;
    console.log(' ApiService loaded and registered');
} else {
    console.log(' ApiService already loaded');
}