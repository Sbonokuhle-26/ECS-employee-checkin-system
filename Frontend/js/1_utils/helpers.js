if (typeof Helpers === 'undefined') {
    class Helpers {
        static formatDate(date, includeTime = true) {
            if (!date) return '-';
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) return '-';
            return includeTime ? dateObj.toLocaleString() : dateObj.toLocaleDateString();
        }
        
        static showMessage(message, type = 'info', container = null) {
            console.log(`${type}: ${message}`);
            if (container) {
                container.textContent = message;
                container.className = `message ${type}`;
            }
        }
        
        static clearMessage(container = null) {
            if (container) container.textContent = '';
        }
        
        static isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        static setDefaultReportDates() {
            const startDate = document.getElementById('report-start-date');
            const endDate = document.getElementById('report-end-date');
            
            if (startDate && !startDate.value) {
                const firstDay = new Date();
                firstDay.setDate(1);
                startDate.value = firstDay.toISOString().split('T')[0];
            }
            
            if (endDate && !endDate.value) {
                const today = new Date();
                endDate.value = today.toISOString().split('T')[0];
            }
        }

        static isValidIP(ip) {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) return false;
    
    const parts = ip.split('.');
    return parts.every(part => {
        const num = parseInt(part, 10);
        return num >= 0 && num <= 255;
    });
}

        // Get client IP address
        static async getClientIP() {
            try {
                // First try to get IP from a public service
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                return data.ip;
            } catch (error) {
                console.warn('Could not fetch public IP, using fallback:', error);
                // Fallback: return a placeholder or try another method
                return '127.0.0.1'; // Localhost as fallback
            }
        }

        // Get device fingerprint (simplified version)
        static getDeviceFingerprint() {
            const navigatorInfo = {
                userAgent: navigator.userAgent,
                language: navigator.language,
                platform: navigator.platform,
                hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
                deviceMemory: navigator.deviceMemory || 'unknown'
            };
            
            // Create a simple fingerprint hash
            const fingerprintString = JSON.stringify(navigatorInfo);
            let hash = 0;
            for (let i = 0; i < fingerprintString.length; i++) {
                const char = fingerprintString.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32-bit integer
            }
            return Math.abs(hash).toString(16);
        }
    }
    window.Helpers = Helpers;
}
