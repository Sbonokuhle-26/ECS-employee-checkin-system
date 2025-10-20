class Attendance {
    constructor(data) {
        this.id = data.checkin_id;
        this.employeeId = data.employee_id;
        this.employeeName = data.employee_name;
        this.checkInTime = data.checkin_time;
        this.checkOutTime = data.checkout_time;
        this.minutesWorked = data.minutes_worked;
        this.ipAddress = data.ip_address;
        this.location = data.location;
        this.departmentName = data.department_name;
    }

    get duration() {
        if (!this.minutesWorked) return '-';
        const hours = Math.floor(this.minutesWorked / 60);
        const minutes = this.minutesWorked % 60;
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    }

    get checkInTimeFormatted() {
        return Helpers.formatDate(this.checkInTime);
    }

    get checkOutTimeFormatted() {
        return this.checkOutTime ? Helpers.formatDate(this.checkOutTime) : 'Not checked out';
    }

    isActive() {
        return !this.checkOutTime;
    }

    toJSON() {
        return {
            checkin_id: this.id,
            employee_id: this.employeeId,
            employee_name: this.employeeName,
            checkin_time: this.checkInTime,
            checkout_time: this.checkOutTime,
            minutes_worked: this.minutesWorked,
            ip_address: this.ipAddress,
            location: this.location,
            department_name: this.departmentName
        };
    }
}