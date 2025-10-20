
if (typeof Constants === 'undefined') {
    class Constants {
        static ROLES = {
            EMPLOYEE: 'employee',
            MANAGER: 'manager',
            SUPER_ADMIN: 'super_admin'
        };
        
        static STATUS = {
            ACTIVE: 'active',
            INACTIVE: 'inactive'
        };
        
        static ENDPOINTS = {
            LOGIN: 'login',
            CHECK_IN: 'check-in',
            CHECK_OUT: 'checkout',
            USERS: 'users',
            DEPARTMENTS: 'departments',
            REPORTS: 'reports',
            ACTIVE_CHECKIN: 'active-checkin',
            LAST_CHECKINOUT: 'last-checkinout'
        };
        
        static MESSAGE_TYPES = {
            SUCCESS: 'success',
            ERROR: 'error',
            INFO: 'info',
            WARNING: 'warning'
        };
    }
    window.Constants = Constants;
}
