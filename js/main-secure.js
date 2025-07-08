// Updated Main.js - Secure Version
// This version uses the secure backend API instead of direct Firebase access

// Global variables
let currentGameVersion = '';
let encryptedAccessLink = '';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Rico World - Secure Version Loaded');
    testAPIConnection();
    initializeEventListeners();
    setTimeout(() => {
        hideLoadingScreen();
    }, 2000);
});

// Test API connection on startup
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

// Initialize event listeners
function initializeEventListeners() {
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
    }

    const gameIdInput = document.getElementById('gameIdInput');
    if (gameIdInput) {
        gameIdInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkGamePassword();
            }
        });
    }
}

// Hide loading screen
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Check main password
async function checkPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput.value.trim();

    if (!password) {
        showError('Please enter an access code');
        return;
    }

    const button = document.querySelector('.access-btn');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    button.disabled = true;

    try {
        const result = await secureAPI.verifyPassword(password, 'main');

        if (result.success) {
            encryptedAccessLink = result.encryptedLink;
            showSuccess('Access granted! Welcome to Rico World');
            setTimeout(() => {
                const accessLink = generateSecureAccessLink(encryptedAccessLink);
                window.location.href = accessLink;
            }, 1500);
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

// Check game password
async function checkGamePassword() {
    const gameIdInput = document.getElementById('gameIdInput');
    const password = gameIdInput.value.trim();

    if (!password) {
        showGameError('Please enter an access code');
        return;
    }

    const button = document.querySelector('.game-access-btn');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    button.disabled = true;

    try {
        const result = await secureAPI.verifyPassword(password, currentGameVersion);

        if (result.success) {
            encryptedAccessLink = result.encryptedLink;
            showNotification(`Access granted for ${currentGameVersion}!`, 'success');
            const accessLink = generateSecureAccessLink(result.encryptedLink);
            setTimeout(() => {
                window.open(accessLink, '_blank');
                closeGameIdPage();
            }, 1500);
        } else {
            showGameError(result.error || 'Invalid access code');
        }
    } catch (error) {
        console.error('Game password verification error:', error);
        showGameError('Connection error. Please try again.');
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;
        gameIdInput.value = '';
    }
}

function generateSecureAccessLink(encryptedLink) {
    const baseURL = window.location.origin;
    return `${baseURL}/secure-access.html?token=${encodeURIComponent(encryptedLink)}`;
}

function closeGameIdPage() {
    const gameIdPage = document.getElementById('gameIdPage');
    if (gameIdPage) {
        gameIdPage.style.opacity = '0';
        setTimeout(() => {
            gameIdPage.style.display = 'none';
        }, 300);
    }

    const gameIdInput = document.getElementById('gameIdInput');
    if (gameIdInput) {
        gameIdInput.value = '';
    }

    hideGameError();
}

function showError(message) {
    const errorMsg = document.getElementById('errorMsg');
    const errorText = errorMsg.querySelector('.message-text');
    if (errorText) errorText.textContent = message;
    if (errorMsg) {
        errorMsg.style.display = 'flex';
        setTimeout(() => {
            errorMsg.style.display = 'none';
        }, 5000);
    }
}

function showSuccess(message) {
    const successMsg = document.getElementById('successMsg');
    const successText = successMsg.querySelector('.message-text');
    if (successText) successText.textContent = message;
    if (successMsg) {
        successMsg.style.display = 'flex';
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 5000);
    }
}

function showGameError(message) {
    const gameErrorMsg = document.getElementById('gameErrorMsg');
    const errorText = gameErrorMsg.querySelector('span');
    if (errorText) errorText.textContent = message;
    if (gameErrorMsg) {
        gameErrorMsg.style.display = 'flex';
        setTimeout(() => {
            gameErrorMsg.style.display = 'none';
        }, 5000);
    }
}

function hideGameError() {
    const gameErrorMsg = document.getElementById('gameErrorMsg');
    if (gameErrorMsg) gameErrorMsg.style.display = 'none';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    const container = document.getElementById('notificationContainer') || document.body;
    container.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function goBack() {
    window.history.back();
}

window.checkPassword = checkPassword;
window.checkGamePassword = checkGamePassword;
window.closeGameIdPage = closeGameIdPage;
window.goBack = goBack;
