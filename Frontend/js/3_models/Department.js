class Department {
    constructor(data) {
        this.id = data.department_id;
        this.name = data.department_name;
    }

    toJSON() {
        return {
            department_id: this.id,
            department_name: this.name
        };
    }
}