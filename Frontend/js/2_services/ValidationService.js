// ValidationService.js
console.log('Loading ValidationService...');

if (typeof ValidationService === 'undefined') {
    class ValidationService {
        static validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        static validatePassword(password) {
            return password && password.length >= 6;
        }

        static validateUserData(userData, isUpdate = false) {
            const errors = [];

            if (!userData.first_name?.trim()) {
                errors.push('First name is required');
            }

            if (!userData.last_name?.trim()) {
                errors.push('Last name is required');
            }

            if (!this.validateEmail(userData.email)) {
                errors.push('Valid email is required');
            }

            if (!userData.department_id) {
                errors.push('Department is required');
            }

            if (!isUpdate && !this.validatePassword(userData.password)) {
                errors.push('Password must be at least 6 characters long');
            }

            return errors;
        }

        static validateCheckInData(checkInData) {
            const errors = [];

            if (!checkInData.employee_id) {
                errors.push('Employee ID is required');
            }

            if (!checkInData.ip_address) {
                errors.push('IP address is required');
            }

            return errors;
        }
       static validateIPs(ips) {
    const errors = [];
    
    if (!ips || ips.length === 0) {
        errors.push('At least one IP address is required');
        return errors;
    }
    
    ips.forEach(ip => {
        if (!ip.ip_address) {
            errors.push('IP address cannot be empty');
        } else if (!Helpers.isValidIP(ip.ip_address)) {
            errors.push(`Invalid IP address: ${ip.ip_address}`);
        }
    });
    
    return errors;
}
    }
    
    window.ValidationService = ValidationService;
    console.log('✓ ValidationService loaded and registered');
} else {
    console.log('✓ ValidationService already loaded');
}