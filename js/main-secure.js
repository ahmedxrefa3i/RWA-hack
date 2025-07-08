// Secure Version of Main.js - using backend API only
secureAPI.setBaseURL('https://rico-secure-backend.onrender.com');

// Global state
let encryptedAccessLink = '';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Rico World - Secure Version Loaded');
    testAPIConnection();
    initializeEventListeners();
    setTimeout(hideLoadingScreen, 2000);
});

// Check API connectivity
async function testAPIConnection() {
    try {
        const health = await secureAPI.healthCheck();
        console.log('✅ API Connection successful:', health);
        showNotification('API Connected Successfully', 'success');
    } catch (error) {
        console.error('❌ API Connection failed:', error);
        showNotification('API Connection Failed - Check console for details', 'error');
    }
}

// Setup keypress on Enter
function initializeEventListeners() {
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkPassword();
        });
    }
}

// Hide loader
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Handle password
async function checkPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput.value.trim();
    const button = document.querySelector('.access-btn');
    const originalText = button.innerHTML;

    if (!password) return showError('Please enter an access code');

    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    button.disabled = true;

    try {
        const result = await secureAPI.verifyPassword(password, 'main');

        // ✅ التعديل هنا: نستخدم result.url بدل result.link
        if (result.success && result.url) {
            encryptedAccessLink = result.url;
            showSuccess('Access granted!');
            setTimeout(() => {
                const iframe = document.getElementById('contentFrame');
                iframe.src = encryptedAccessLink;
                iframe.style.display = 'block';

                const form = document.querySelector('.access-form');
                if (form) form.style.display = 'none';

                history.replaceState({}, document.title, window.location.pathname);
            }, 1000);
        } else {
            showError(result.error || 'Invalid access code');
        }
    } catch (error) {
        console.error('Password verification error:', error);
        showError('Connection error. Please try again.');
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;
        passwordInput.value = '';
    }
}

// Show error
function showError(message) {
    const box = document.getElementById('errorMsg');
    const text = box?.querySelector('.message-text');
    if (text) text.textContent = message;
    if (box) {
        box.style.display = 'flex';
        setTimeout(() => box.style.display = 'none', 5000);
    }
}

// Show success
function showSuccess(message) {
    const box = document.getElementById('successMsg');
    const text = box?.querySelector('.message-text');
    if (text) text.textContent = message;
    if (box) {
        box.style.display = 'flex';
        setTimeout(() => box.style.display = 'none', 5000);
    }
}

// Show floating notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    const container = document.getElementById('notificationContainer') || document.body;
    container.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Public access
window.checkPassword = checkPassword;
