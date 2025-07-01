// Admin Panel JavaScript for Rico World App

// ===== ADMIN VARIABLES =====
let isAdminAuthenticated = false;
let visitorsData = [];
let blockedIPs = [];
let accessLogs = [];

// ===== ADMIN AUTHENTICATION =====
async function verifyAdmin() {
    const adminPasswordInput = document.getElementById("adminPassword");
    const password = adminPasswordInput.value.trim();
    
    if (!password) {
        showNotification("Please enter admin password", "error");
        Utils.addAnimation(adminPasswordInput, "shake");
        return;
    }
    
    if (password === ADMIN_PASSWORD) {
        isAdminAuthenticated = true;
        showAdminControls();
        showNotification("Login successful", "success");
        adminPasswordInput.value = "";
        
        // Load admin data
        await loadAdminData();
    } else {
        showNotification("Incorrect password!", "error");
        Utils.addAnimation(adminPasswordInput, "shake");
        adminPasswordInput.value = "";
        
        // Log failed admin attempt
        await logAdminAttempt(false);
    }
}

// Show admin controls
function showAdminControls() {
    const adminControls = document.getElementById("adminControls");
    const adminLogin = document.querySelector(".admin-login");
    
    if (adminControls && adminLogin) {
        adminLogin.style.display = "none";
        adminControls.style.display = "block";
        Utils.addAnimation(adminControls, "fade-in-up");
    }
}

// Log admin login attempt
async function logAdminAttempt(success) {
    try {
        const ip = await Utils.getUserIP();
        const logData = {
            type: "admin_login",
            ip: ip,
            success: success,
            timestamp: new Date(),
            userAgent: navigator.userAgent
        };
        
        await FirebaseHelper.logAccess(logData);
    } catch (error) {
        console.error("Error logging admin attempt:", error);
    }
}

// ===== LOAD ADMIN DATA =====
async function loadAdminData() {
    try {
        showNotification("Loading data...", "info");
        
        // Load visitors
        await loadVisitors();
        
        // Load blocked IPs
        await loadBlockedIPs();
        
        // Load access logs
        await loadAccessLogs();
        
        // Load and display statistics
        await loadStatistics();
        
        showNotification("Data loaded successfully", "success");
    } catch (error) {
        console.error("Error loading admin data:", error);
        showNotification("Error loading data", "error");
    }
}

// ===== VISITORS MANAGEMENT =====
async function loadVisitors() {
    try {
        visitorsData = await FirebaseHelper.getVisitors(50);
        displayVisitors();
    } catch (error) {
        console.error("Error loading visitors:", error);
        showNotification("Error loading visitors list", "error");
    }
}

function displayVisitors() {
    const visitorsList = document.getElementById("visitorsList");
    if (!visitorsList) return;
    
    if (visitorsData.length === 0) {
        visitorsList.innerHTML = "<p class=\"no-data\">No visitor data available</p>";
        return;
    }
    
    let tableHTML = `
        <table class=\"visitors-table\">
            <thead>
                <tr>
                    <th>IP</th>
                    <th>Location</th>
                    <th>Device</th>
                    <th>Browser</th>
                    <th>Time</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    visitorsData.forEach(visitor => {
        const location = visitor.location || {};
        const device = visitor.device || {};
        const timeAgo = Utils.formatTimestamp(visitor.timestamp);
        
        tableHTML += `
            <tr>
                <td class=\"ip-cell\">${visitor.ip || "N/A"}</td>
                <td>${location.country || "N/A"}, ${location.city || ""}</td>
                <td>${device.device || "N/A"}</td>
                <td>${device.browser || "N/A"}</td>
                <td>${timeAgo}</td>
                <td class=\"actions-cell\">
                    <button class=\"action-btn block-btn\" onclick=\"blockVisitorIP('${visitor.ip}')\" title=\"Block IP\">
                        <i class=\"fas fa-ban\"></i>
                    </button>
                    <button class=\"action-btn info-btn\" onclick=\"showVisitorDetails('${visitor.id}')\" title=\"Details\">
                        <i class=\"fas fa-info\"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableHTML += "</tbody></table>";
    visitorsList.innerHTML = tableHTML;
}

// Block visitor IP
async function blockVisitorIP(ip) {
    if (!ip || ip === "N/A") {
        showNotification("Invalid IP", "error");
        return;
    }
    
    if (confirm(`Are you sure you want to block IP: ${ip}?`)) {
        try {
            await FirebaseHelper.blockIP(ip, "Blocked from admin panel");
            showNotification(`IP blocked: ${ip}`, "success");
            await loadBlockedIPs(); // Refresh blocked IPs list
        } catch (error) {
            console.error("Error blocking IP:", error);
            showNotification("Error blocking IP", "error");
        }
    }
}

// Show visitor details
function showVisitorDetails(visitorId) {
    const visitor = visitorsData.find(v => v.id === visitorId);
    if (!visitor) return;
    
    const device = visitor.device || {};
    const location = visitor.location || {};
    
    const detailsHTML = `
        <div class=\"visitor-details-modal\">
            <div class=\"modal-content\">
                <div class=\"modal-header\">
                    <h3>Visitor Details</h3>
                    <button class=\"close-modal\" onclick=\"closeModal()\">&times;</button>
                </div>
                <div class=\"modal-body\">
                    <div class=\"detail-row\">
                        <strong>IP:</strong> ${visitor.ip || "N/A"}
                    </div>
                    <div class=\"detail-row\">
                        <strong>Country:</strong> ${location.country || "N/A"}
                    </div>
                    <div class=\"detail-row\">
                        <strong>City:</strong> ${location.city || "N/A"}
                    </div>
                    <div class=\"detail-row\">
                        <strong>Timezone:</strong> ${location.timezone || "N/A"}
                    </div>
                    <div class=\"detail-row\">
                        <strong>Device Type:</strong> ${device.device || "N/A"}
                    </div>
                    <div class=\"detail-row\">
                        <strong>Browser:</strong> ${device.browser || "N/A"}
                    </div>
                    <div class=\"detail-row\">
                        <strong>Operating System:</strong> ${device.os || "N/A"}
                    </div>
                    <div class=\"detail-row\">
                        <strong>Screen Resolution:</strong> ${device.screenResolution || "N/A"}
                    </div>
                    <div class=\"detail-row\">
                        <strong>Language:</strong> ${device.language || "N/A"}
                    </div>
                    <div class=\"detail-row\">
                        <strong>Visit Time:</strong> ${Utils.formatTimestamp(visitor.timestamp)}
                    </div>
                    <div class=\"detail-row\">
                        <strong>Referrer:</strong> ${visitor.referrer || "Direct"}
                    </div>
                </div>
                <div class=\"modal-footer\">
                    <button class=\"btn btn-danger\" onclick=\"blockVisitorIP('${visitor.ip}')\">
                        <i class=\"fas fa-ban\"></i> Block IP
                    </button>
                    <button class=\"btn btn-secondary\" onclick=\"closeModal()\">Close</button>
                </div>
            </div>
        </div>
    `;
    
    showModal(detailsHTML);
}

// ===== IP BLOCKING MANAGEMENT =====
async function loadBlockedIPs() {
    try {
        blockedIPs = await FirebaseHelper.getBlockedIPs();
        displayBlockedIPs();
    } catch (error) {
        console.error("Error loading blocked IPs:", error);
    }
}

function displayBlockedIPs() {
    // This could be displayed in a separate section
    console.log("Blocked IPs:", blockedIPs);
}

async function blockIP() {
    const ipInput = document.getElementById("ipToBlock");
    const ip = ipInput.value.trim();
    
    if (!ip) {
        showNotification("Please enter IP to block", "error");
        Utils.addAnimation(ipInput, "shake");
        return;
    }
    
    if (!Utils.isValidIP(ip)) {
        showNotification("Invalid IP", "error");
        Utils.addAnimation(ipInput, "shake");
        return;
    }
    
    try {
        await FirebaseHelper.blockIP(ip, "Manual block from admin");
        showNotification(`IP blocked: ${ip}`, "success");
        ipInput.value = "";
        await loadBlockedIPs();
    } catch (error) {
        console.error("Error blocking IP:", error);
        showNotification("Error blocking IP", "error");
    }
}

async function unblockIP() {
    const ipInput = document.getElementById("ipToUnblock");
    const ip = ipInput.value.trim();
    
    if (!ip) {
        showNotification("Please enter IP to unblock", "error");
        Utils.addAnimation(ipInput, "shake");
        return;
    }
    
    try {
        await FirebaseHelper.unblockIP(ip);
        showNotification(`IP unblocked: ${ip}`, "success");
        ipInput.value = "";
        await loadBlockedIPs();
    } catch (error) {
        console.error("Error unblocking IP:", error);
        showNotification("Error unblocking IP", "error");
    }
}

// ===== ACCESS LOGS =====
async function loadAccessLogs() {
    try {
        accessLogs = await FirebaseHelper.getAccessLogs(100);
        console.log("Access logs loaded:", accessLogs.length);
    } catch (error) {
        console.error("Error loading access logs:", error);
    }
}

// ===== STATISTICS =====
async function loadStatistics() {
    try {
        const todayStats = await FirebaseHelper.getTodayStats();
        const weekStats = await FirebaseHelper.getStatistics(7);
        
        updateStatisticsDisplay(todayStats, weekStats);
    } catch (error) {
        console.error("Error loading statistics:", error);
    }
}

function updateStatisticsDisplay(todayStats, weekStats) {
    // Update today's stats
    const totalVisitorsEl = document.getElementById("totalVisitors");
    const todayVisitorsEl = document.getElementById("todayVisitors");
    const successfulAccessEl = document.getElementById("successfulAccess");
    
    if (totalVisitorsEl) {
        totalVisitorsEl.textContent = todayStats.totalVisitors || 0;
    }
    
    if (todayVisitorsEl) {
        todayVisitorsEl.textContent = todayStats.totalVisitors || 0;
    }
    
    if (successfulAccessEl) {
        successfulAccessEl.textContent = todayStats.successfulAccess || 0;
    }
    
    // Calculate weekly totals
    let weeklyTotal = 0;
    let weeklySuccess = 0;
    
    Object.values(weekStats).forEach(dayStats => {
        weeklyTotal += dayStats.totalVisitors || 0;
        weeklySuccess += dayStats.successfulAccess || 0;
    });
    
    console.log("Weekly stats:", { weeklyTotal, weeklySuccess });
}

// ===== MODAL FUNCTIONS =====
function showModal(content) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = content;
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    document.body.appendChild(modal);
    Utils.addAnimation(modal, "fade-in");
    
    // Close on outside click
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.querySelector(".modal-overlay");
    if (modal) {
        modal.style.opacity = "0";
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// ===== DATA EXPORT =====
async function exportVisitorsData() {
    try {
        const allVisitors = await FirebaseHelper.getVisitors(1000);
        const csvData = convertToCSV(allVisitors);
        downloadCSV(csvData, "visitors_data.csv");
        showNotification("Visitor data exported", "success");
    } catch (error) {
        console.error("Error exporting data:", error);
        showNotification("Error exporting data", "error");
    }
}

function convertToCSV(data) {
    if (!data.length) return "";
    
    const headers = ["IP", "Country", "City", "Device", "Browser", "OS", "Timestamp"];
    const csvRows = [headers.join(",")];
    
    data.forEach(visitor => {
        const location = visitor.location || {};
        const device = visitor.device || {};
        const row = [
            visitor.ip || "",
            location.country || "",
            location.city || "",
            device.device || "",
            device.browser || "",
            device.os || "",
            visitor.timestamp ? new Date(visitor.timestamp.seconds * 1000).toISOString() : ""
        ];
        csvRows.push(row.join(","));
    });
    
    return csvRows.join("\n");
}

function downloadCSV(csvData, filename) {
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// ===== CLEANUP AND MAINTENANCE =====
async function cleanupOldData() {
    if (confirm("Are you sure you want to delete old data (older than 30 days)?")) {
        try {
            showNotification("Cleaning up data...", "info");
            await FirebaseHelper.cleanupOldData(30);
            showNotification("Old data cleaned up", "success");
            await loadAdminData(); // Refresh data
        } catch (error) {
            console.error("Error cleaning up data:", error);
            showNotification("Error cleaning up data", "error");
        }
    }
}

// ===== REAL-TIME UPDATES =====
function setupAdminRealtimeUpdates() {
    if (!isAdminAuthenticated) return;
    
    // Listen for new visitors
    FirebaseHelper.onVisitorsChange((snapshot) => {
        if (snapshot.docChanges) {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    showNotification("New visitor!", "info", 3000);
                    loadVisitors(); // Refresh visitors list
                }
            });
        }
    });
}

// ===== ADMIN SHORTCUTS =====
function setupAdminShortcuts() {
    document.addEventListener("keydown", (e) => {
        if (!isAdminAuthenticated) return;
        
        // Ctrl + R: Refresh data
        if (e.ctrlKey && e.key === "r") {
            e.preventDefault();
            loadAdminData();
            showNotification("Data refreshed", "info");
        }
        
        // Ctrl + E: Export data
        if (e.ctrlKey && e.key === "e") {
            e.preventDefault();
            exportVisitorsData();
        }
        
        // Ctrl + D: Cleanup data
        if (e.ctrlKey && e.shiftKey && e.key === "D") {
            e.preventDefault();
            cleanupOldData();
        }
    });
}

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
    setupAdminShortcuts();
});

// ===== EXPORT FUNCTIONS =====
window.verifyAdmin = verifyAdmin;
window.blockIP = blockIP;
window.unblockIP = unblockIP;
window.blockVisitorIP = blockVisitorIP;
window.showVisitorDetails = showVisitorDetails;
window.closeModal = closeModal;
window.exportVisitorsData = exportVisitorsData;
window.cleanupOldData = cleanupOldData;
window.loadAdminData = loadAdminData;
window.isAdminAuthenticated = isAdminAuthenticated;
window.showAdminControls = showAdminControls;
window.logAdminAttempt = logAdminAttempt;
window.loadVisitors = loadVisitors;
window.displayVisitors = displayVisitors;
window.loadBlockedIPs = loadBlockedIPs;
window.displayBlockedIPs = displayBlockedIPs;
window.loadAccessLogs = loadAccessLogs;
window.loadStatistics = loadStatistics;
window.updateStatisticsDisplay = updateStatisticsDisplay;
window.showModal = showModal;
window.convertToCSV = convertToCSV;
window.downloadCSV = downloadCSV;
window.setupAdminRealtimeUpdates = setupAdminRealtimeUpdates;
window.setupAdminShortcuts = setupAdminShortcuts;


