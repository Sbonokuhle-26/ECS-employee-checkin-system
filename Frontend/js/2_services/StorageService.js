// StorageService.js
console.log('Loading StorageService...');

if (typeof StorageService === 'undefined') {
    class StorageService {
        setItem(key, value) {
            try {
                localStorage.setItem(key, value);
                return true;
            } catch (error) {
                console.error('Error storing data:', error);
                return false;
            }
        }

        getItem(key) {
            try {
                return localStorage.getItem(key);
            } catch (error) {
                console.error('Error retrieving data:', error);
                return null;
            }
        }

        removeItem(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Error removing data:', error);
                return false;
            }
        }

        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.error('Error clearing storage:', error);
                return false;
            }
        }
    }
    
    window.StorageService = StorageService;
    console.log('✓ StorageService loaded and registered');
} else {
    console.log('✓ StorageService already loaded');
}