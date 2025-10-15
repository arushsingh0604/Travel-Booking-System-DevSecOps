/**
 * Admin Dashboard Management
 * Handles common dashboard functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Initializing admin dashboard...');
    
    /**
     * Show an alert message
     * @param {string} type - The type of alert (success, error, warning)
     * @param {string} message - The message to display
     */
    function showAlert(type, message) {
        const alertContainer = document.getElementById('alertContainer');
        if (!alertContainer) return;
        
        console.log(`🔔 Showing ${type} alert:`, message);
        
        // Clear any existing alerts
        const existingAlert = document.getElementById('currentAlert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        alert.id = 'currentAlert';
        
        alertContainer.appendChild(alert);
        alert.style.display = 'block';
        
        // Auto-hide alerts
        if (type === 'success') {
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.remove();
                }
            }, 3000);
        } else if (type === 'warning') {
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.remove();
                }
            }, 5000);
        }
    }
    
    // Make showAlert available globally for other scripts if needed
    window.showAlert = showAlert;
    
    console.log('✅ Admin dashboard utilities initialized');
});
