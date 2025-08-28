// Enhanced Anti-DevTools Protection for JavaScript
(function() {
    'use strict';
    
    // Advanced obfuscation and protection wrapper
    const protectionWrapper = function() {
        // Multiple DevTools detection methods
        let detectionActive = true;
        let protectionLevel = 5;
        
        // Method 1: Console hijacking with detection
        const originalConsole = window.console;
        let consoleAccessCount = 0;
        
        Object.defineProperty(window, 'console', {
            get: function() {
                consoleAccessCount++;
                if (consoleAccessCount > 3) {
                    triggerProtection('Console access detected');
                }
                return originalConsole;
            },
            set: function() {
                triggerProtection('Console modification attempt');
            },
            configurable: false
        });
        
        // Method 2: Debugger statement with timing
        function debuggerCheck() {
            const start = performance.now();
            debugger;
            const end = performance.now();
            
            if (end - start > 100) {
                triggerProtection('Debugger timing anomaly');
            }
        }
        
        // Method 3: Function toString detection
        const originalToString = Function.prototype.toString;
        Function.prototype.toString = function() {
            if (this === debuggerCheck || this === triggerProtection) {
                triggerProtection('Function inspection detected');
            }
            return originalToString.apply(this, arguments);
        };
        
        // Method 4: DevTools size detection
        function sizeCheck() {
            const threshold = 160;
            const widthDiff = window.outerWidth - window.innerWidth;
            const heightDiff = window.outerHeight - window.innerHeight;
            
            if (widthDiff > threshold || heightDiff > threshold) {
                triggerProtection('Window size anomaly');
            }
        }
        
        // Method 5: Performance monitoring
        function performanceCheck() {
            const start = performance.now();
            for (let i = 0; i < 100000; i++) {
                // Simple loop
            }
            const end = performance.now();
            
            if (end - start > 50) {
                triggerProtection('Performance anomaly detected');
            }
        }
        
        // Protection trigger function
        function triggerProtection(reason) {
            if (!detectionActive) return;
            
            console.clear();
            
            // Multiple protection layers
            document.body.innerHTML = '';
            document.documentElement.innerHTML = '';
            
            // Attempt to close/redirect
            try {
                window.location.href = 'about:blank';
            } catch(e) {}
            
            try {
                window.close();
            } catch(e) {}
            
            // Infinite alert loop
            while(true) {
                alert('Access Denied - DevTools Protection Active');
            }
        }
        
        // Continuous monitoring
        setInterval(function() {
            if (detectionActive) {
                debuggerCheck();
                sizeCheck();
                performanceCheck();
            }
        }, Math.random() * 1000 + 500);
        
        // Event-based detection
        window.addEventListener('resize', sizeCheck);
        window.addEventListener('focus', debuggerCheck);
        window.addEventListener('blur', performanceCheck);
        
        // Keyboard protection
        document.addEventListener('keydown', function(e) {
            const forbiddenKeys = [
                123, // F12
                {ctrl: true, shift: true, key: 73}, // Ctrl+Shift+I
                {ctrl: true, shift: true, key: 74}, // Ctrl+Shift+J
                {ctrl: true, shift: true, key: 67}, // Ctrl+Shift+C
                {ctrl: true, key: 85}, // Ctrl+U
                {ctrl: true, key: 83}, // Ctrl+S
                {ctrl: true, key: 65}, // Ctrl+A
                {ctrl: true, key: 80}  // Ctrl+P
            ];
            
            const isBlocked = forbiddenKeys.some(blocked => {
                if (typeof blocked === 'number') {
                    return e.keyCode === blocked;
                }
                return (blocked.ctrl ? e.ctrlKey : true) &&
                       (blocked.shift ? e.shiftKey : true) &&
                       e.keyCode === blocked.key;
            });
            
            if (isBlocked) {
                e.preventDefault();
                e.stopPropagation();
                triggerProtection('Forbidden key combination');
                return false;
            }
        });
        
        // Context menu protection
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            triggerProtection('Context menu access attempt');
            return false;
        });
        
        return {
            disable: function() {
                detectionActive = false;
            },
            enable: function() {
                detectionActive = true;
            }
        };
    };
    
    // Initialize protection
    const protection = protectionWrapper();
    
    // Original main-secure.js content with protection
    secureAPI.setBaseURL("https://rico-secure-backend.onrender.com");
    let encryptedAccessLink = "";
    
    async function testAPIConnection() {
        try {
            const response = await secureAPI.healthCheck();
            console.log("✅ API Connection successful:", response);
            showNotification("API Connected Successfully", "success");
        } catch (error) {
            console.error("❌ API Connection failed:", error);
            showNotification("API Connection Failed - Check console for details", "error");
        }
    }
    
    function initializeEventListeners() {
        const passwordInput = document.getElementById("passwordInput");
        if (passwordInput) {
            passwordInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    checkPassword();
                }
            });
        }
    }
    
    function hideLoadingScreen() {
        const loadingScreen = document.getElementById("loadingScreen");
        if (loadingScreen) {
            loadingScreen.style.opacity = "0";
            setTimeout(() => {
                loadingScreen.style.display = "none";
            }, 500);
        }
    }
    
    async function checkPassword() {
        const passwordInput = document.getElementById("passwordInput");
        const password = passwordInput.value.trim();
        const accessBtn = document.querySelector(".access-btn");
        const originalBtnText = accessBtn.innerHTML;
        
        if (!password) {
            showError("Please enter an access code");
            return;
        }
        
        accessBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
        accessBtn.disabled = true;
        
        try {
            const response = await secureAPI.verifyPassword(password, "main");
            
            if (response.success && response.url) {
                encryptedAccessLink = response.url;
                showSuccess("Access granted!");
                
                setTimeout(() => {
                    const contentFrame = document.getElementById("contentFrame");
                    contentFrame.src = encryptedAccessLink;
                    contentFrame.style.display = "block";
                    
                    // Hide alert buttons
                    const alertButtons = [
                        document.querySelector("button[onclick*='alertBox']"),
                        document.querySelector("button[onclick*='showAlertModal']"),
                        document.querySelector("button[onclick*='alertModal']"),
                        document.querySelector("button[style*='crimson']"),
                        document.querySelector("button i.fa-exclamation")
                    ];
                    
                    alertButtons.forEach(btn => {
                        if (btn) {
                            btn.style.display = "none";
                            console.log("Alert button hidden");
                        }
                        if (btn && btn.parentElement) {
                            btn.parentElement.style.display = "none";
                        }
                    });
                    
                    // Hide bottom left alert buttons
                    document.querySelectorAll('button[style*="position: fixed"][style*="bottom"][style*="left"]').forEach(btn => {
                        if (btn.style.background.includes("crimson") || btn.innerHTML.includes("fa-exclamation")) {
                            btn.style.display = "none";
                            console.log("Bottom left alert button hidden");
                        }
                    });
                    
                    const accessForm = document.querySelector(".access-form");
                    if (accessForm) {
                        accessForm.style.display = "none";
                    }
                    
                    history.replaceState({}, document.title, window.location.pathname);
                }, 1000);
            } else {
                showError(response.error || "Invalid access code");
            }
        } catch (error) {
            console.error("Password verification error:", error);
            showError("Connection error. Please try again.");
        } finally {
            accessBtn.innerHTML = originalBtnText;
            accessBtn.disabled = false;
            passwordInput.value = "";
        }
    }
    
    function showError(message) {
        const errorMsg = document.getElementById("errorMsg");
        const messageText = errorMsg?.querySelector(".message-text");
        if (messageText) {
            messageText.textContent = message;
        }
        if (errorMsg) {
            errorMsg.style.display = "flex";
            setTimeout(() => errorMsg.style.display = "none", 5000);
        }
    }
    
    function showSuccess(message) {
        const successMsg = document.getElementById("successMsg");
        const messageText = successMsg?.querySelector(".message-text");
        if (messageText) {
            messageText.textContent = message;
        }
        if (successMsg) {
            successMsg.style.display = "flex";
            setTimeout(() => successMsg.style.display = "none", 5000);
        }
    }
    
    function showNotification(message, type = "info") {
        const notification = document.createElement("div");
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-triangle" : "info-circle"}"></i>
            <span>${message}</span>
        `;
        
        const container = document.getElementById("notificationContainer") || document.body;
        container.appendChild(notification);
        
        setTimeout(() => notification.classList.add("show"), 10);
        setTimeout(() => {
            notification.classList.remove("show");
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    document.addEventListener("DOMContentLoaded", () => {
        console.log("🚀 Rico World - Secure Version Loaded");
        testAPIConnection();
        initializeEventListeners();
        setTimeout(hideLoadingScreen, 2000);
    });
    
    // Make checkPassword globally available
    window.checkPassword = checkPassword;
    
    // Additional protection measures
    
    // Prevent common inspection methods
    Object.defineProperty(window, 'devtools', {
        get: function() {
            protection.triggerProtection('DevTools object access');
        },
        set: function() {
            protection.triggerProtection('DevTools object modification');
        }
    });
    
    // Monitor for suspicious global variables
    const suspiciousGlobals = ['__REACT_DEVTOOLS_GLOBAL_HOOK__', '__VUE_DEVTOOLS_GLOBAL_HOOK__'];
    suspiciousGlobals.forEach(global => {
        if (window[global]) {
            protection.triggerProtection(`Suspicious global detected: ${global}`);
        }
    });
    
    // Prevent script injection
    const originalAppendChild = Node.prototype.appendChild;
    Node.prototype.appendChild = function(child) {
        if (child.tagName === 'SCRIPT' && !child.src.includes('rico-secure-backend')) {
            protection.triggerProtection('Script injection attempt');
        }
        return originalAppendChild.call(this, child);
    };
    
})();

