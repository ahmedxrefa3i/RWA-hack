// Updated Main.js - Secure Version
// This version uses the secure backend API instead of direct Firebase access

// Global variables
let currentGameVersion = '';
let encryptedAccessLink = '';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Rico World - Secure Version Loaded');
    
    // Test API connection
    testAPIConnection();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Hide loading screen after a delay
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
    // Main password input
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
    }

    // Game password input
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

// Check main password (updated to use secure API)
async function checkPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput.value.trim();

    if (!password) {
        showError('Please enter an access code');
        return;
    }

    // Show loading state
    const button = document.querySelector('.access-btn');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    button.disabled = true;

    try {
        // Use secure API instead of direct Firebase
        const result = await secureAPI.verifyPassword(password, 'main');

        if (result.success) {
            // Store encrypted link
            encryptedAccessLink = result.encryptedLink;
            
            showSuccess('Access granted! Welcome to Rico World');
            
            // Hide main form and show admin panel or redirect
            setTimeout(() => {
                showAdminPanel();
            }, 1500);
        } else {
            showError(result.error || 'Invalid access code');
        }

    } catch (error) {
        console.error('Password verification error:', error);
        showError('Connection error. Please try again.');
    } finally {
        // Restore button state
        button.innerHTML = originalText;
        button.disabled = false;
        passwordInput.value = '';
    }
}

// Check game password (updated to use secure API)
async function checkGamePassword() {
    const gameIdInput = document.getElementById('gameIdInput');
    const password = gameIdInput.value.trim();

    if (!password) {
        showGameError('Please enter an access code');
        return;
    }

    // Show loading state
    const button = document.querySelector('.game-access-btn');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    button.disabled = true;

    try {
        // Use secure API instead of direct Firebase
        const result = await secureAPI.verifyPassword(password, currentGameVersion);

        if (result.success) {
            // Store encrypted link
            encryptedAccessLink = result.encryptedLink;
            
            showNotification(`Access granted for ${currentGameVersion}!`, 'success');
            
            // Generate the secure access link
            const accessLink = generateSecureAccessLink(result.encryptedLink);
            
            // Redirect to the secure content
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
        // Restore button state
        button.innerHTML = originalText;
        button.disabled = false;
        gameIdInput.value = '';
    }
}

// Generate secure access link
function generateSecureAccessLink(encryptedLink) {
    // Create a secure URL with the encrypted link
    const baseURL = window.location.origin;
    return `${baseURL}/secure-access.html?token=${encodeURIComponent(encryptedLink)}`;
}

// Open game ID page
function openGameIdPage(gameVersion) {
    currentGameVersion = gameVersion;
    const gameIdPage = document.getElementById('gameIdPage');
    const gameTitle = document.getElementById('selectedGameTitle');
    
    if (gameTitle) {
        gameTitle.textContent = gameVersion;
    }
    
    if (gameIdPage) {
        gameIdPage.style.display = 'flex';
        gameIdPage.style.opacity = '0';
        setTimeout(() => {
            gameIdPage.style.opacity = '1';
        }, 10);
    }
    
    // Focus on input
    const gameIdInput = document.getElementById('gameIdInput');
    if (gameIdInput) {
        setTimeout(() => {
            gameIdInput.focus();
        }, 300);
    }
}

// Close game ID page
function closeGameIdPage() {
    const gameIdPage = document.getElementById('gameIdPage');
    if (gameIdPage) {
        gameIdPage.style.opacity = '0';
        setTimeout(() => {
            gameIdPage.style.display = 'none';
        }, 300);
    }
    
    // Clear input
    const gameIdInput = document.getElementById('gameIdInput');
    if (gameIdInput) {
        gameIdInput.value = '';
    }
    
    // Hide error message
    hideGameError();
}

// Show admin panel
function showAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    const mainContainer = document.getElementById('mainContainer');
    
    if (adminPanel && mainContainer) {
        mainContainer.style.display = 'none';
        adminPanel.style.display = 'block';
        adminPanel.style.opacity = '0';
        setTimeout(() => {
            adminPanel.style.opacity = '1';
        }, 10);
    }
}

// Toggle games menu
function toggleGamesMenu() {
    const gamesMenu = document.getElementById('gamesMenu');
    if (gamesMenu) {
        if (gamesMenu.style.display === 'block') {
            gamesMenu.style.opacity = '0';
            setTimeout(() => {
                gamesMenu.style.display = 'none';
            }, 300);
        } else {
            gamesMenu.style.display = 'block';
            gamesMenu.style.opacity = '0';
            setTimeout(() => {
                gamesMenu.style.opacity = '1';
            }, 10);
        }
    }
}

// Show error message
function showError(message) {
    const errorMsg = document.getElementById('errorMsg');
    const errorText = errorMsg.querySelector('.message-text');
    
    if (errorText) {
        errorText.textContent = message;
    }
    
    if (errorMsg) {
        errorMsg.style.display = 'flex';
        setTimeout(() => {
            errorMsg.style.display = 'none';
        }, 5000);
    }
}

// Show success message
function showSuccess(message) {
    const successMsg = document.getElementById('successMsg');
    const successText = successMsg.querySelector('.message-text');
    
    if (successText) {
        successText.textContent = message;
    }
    
    if (successMsg) {
        successMsg.style.display = 'flex';
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 5000);
    }
}

// Show game error message
function showGameError(message) {
    const gameErrorMsg = document.getElementById('gameErrorMsg');
    const errorText = gameErrorMsg.querySelector('span');
    
    if (errorText) {
        errorText.textContent = message;
    }
    
    if (gameErrorMsg) {
        gameErrorMsg.style.display = 'flex';
        setTimeout(() => {
            gameErrorMsg.style.display = 'none';
        }, 5000);
    }
}

// Hide game error message
function hideGameError() {
    const gameErrorMsg = document.getElementById('gameErrorMsg');
    if (gameErrorMsg) {
        gameErrorMsg.style.display = 'none';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    const container = document.getElementById('notificationContainer') || document.body;
    container.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Open Discord (placeholder)
function openDiscord() {
    showNotification('Discord link would open here', 'info');
}

// Go back function
function goBack() {
    // Implement navigation logic
    window.history.back();
}

// Theme toggle (placeholder)
function toggleTheme() {
    showNotification('Theme toggle functionality', 'info');
}

// Show stats (placeholder)
function showStats() {
    showNotification('Statistics panel would open here', 'info');
}

// Show settings (placeholder)
function showSettings() {
    showNotification('Settings panel would open here', 'info');
}

// Admin functions (placeholders)
function verifyAdmin() {
    showNotification('Admin verification would happen here', 'info');
}

function blockIP() {
    showNotification('IP blocking functionality', 'info');
}

function unblockIP() {
    showNotification('IP unblocking functionality', 'info');
}

// Export functions for global access
window.checkPassword = checkPassword;
window.checkGamePassword = checkGamePassword;
window.openGameIdPage = openGameIdPage;
window.closeGameIdPage = closeGameIdPage;
window.toggleGamesMenu = toggleGamesMenu;
window.openDiscord = openDiscord;
window.goBack = goBack;
window.toggleTheme = toggleTheme;
window.showStats = showStats;
window.showSettings = showSettings;
window.verifyAdmin = verifyAdmin;
window.blockIP = blockIP;
window.unblockIP = unblockIP;

