// Make sure User is available globally
if (typeof User === 'undefined') {
    class User {
        constructor(data) {
            this.id = data.employee_id;
            this.firstName = data.first_name;
            this.lastName = data.last_name;
            this.email = data.email;
            this.role = data.role;
            this.status = data.status;
            this.departmentId = data.department_id;
            this.departmentName = data.department_name;
            this.hireDate = data.hire_date;
            this.allowedIPs = data.allowed_ips || [];
        }

        get fullName() {
            return `${this.firstName} ${this.lastName}`;
        }

        isActive() {
            return this.status === Constants.STATUS.ACTIVE;
        }

        hasRole(role) {
            return this.role === role;
        }

        canEdit(targetUser) {
    if (!targetUser) return false;
    
    // Users can always edit their own profile
    if (this.id === targetUser.id) return true;

    if (this.role === Constants.ROLES.SUPER_ADMIN) {
        return true; // Super admin can edit anyone
    }

    if (this.role === Constants.ROLES.MANAGER) {
        // Managers can edit employees but not other managers or super admins
        return targetUser.role === Constants.ROLES.EMPLOYEE;
    }

    return false; // Employees can only edit themselves
}

canDelete(targetUser) {
    if (!targetUser) return false;
    if (this.id === targetUser.id) return false; // Cannot delete yourself

    if (this.role === Constants.ROLES.SUPER_ADMIN) {
        return targetUser.role !== Constants.ROLES.SUPER_ADMIN; // Cannot delete other super admins
    }

    if (this.role === Constants.ROLES.MANAGER) {
        return targetUser.role === Constants.ROLES.EMPLOYEE; // Can only delete employees
    }

    return false; // Employees cannot delete anyone
}

        toJSON() {
            return {
                employee_id: this.id,
                first_name: this.firstName,
                last_name: this.lastName,
                email: this.email,
                role: this.role,
                status: this.status,
                department_id: this.departmentId,
                department_name: this.departmentName,
                hire_date: this.hireDate,
                allowed_ips: this.allowedIPs
            };
        }
    }
    
    // Export to global scope
    window.User = User;
}