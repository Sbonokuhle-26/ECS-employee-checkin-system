class BaseComponent {
    constructor() {
        this.app = window.employeeApp;
        this.auth = this.app?.auth;
        this.api = this.app?.apiService;
        this.element = null;
    }

    async render() {
        throw new Error('render method must be implemented by child class');
    }

    bindEvents() {
        // To be implemented by child classes
    }

    destroy() {
        if (this.element) {
            this.element.remove();
        }
        this.element = null;
    }

    showMessage(message, type = Constants.MESSAGE_TYPES.INFO, containerId = null) {
        Helpers.showMessage(message, type, containerId ? document.getElementById(containerId) : null);
    }

    clearMessage(containerId = null) {
        Helpers.clearMessage(containerId ? document.getElementById(containerId) : null);
    }

    async handleApiCall(apiCall, successMessage = null, errorMessage = null) {
        try {
            const response = await apiCall();
            if (response.success) {
                if (successMessage) {
                    this.showMessage(successMessage, Constants.MESSAGE_TYPES.SUCCESS);
                }
                return response;
            } else {
                throw new Error(response.error || 'Operation failed');
            }
        } catch (error) {
            const finalErrorMessage = errorMessage || error.message;
            this.showMessage(finalErrorMessage, Constants.MESSAGE_TYPES.ERROR);
            throw error;
        }
    }
}