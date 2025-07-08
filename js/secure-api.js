// Secure API Client for Rico World
// This replaces direct Firebase access with secure backend API calls

class SecureAPI {
    constructor() {
        // Replace this with your deployed Render URL
        this.baseURL = 'https://rico-secure-backend.onrender.com';
        // For local testing, use: this.baseURL = 'http://localhost:3000/api';
    }

    // Helper method to make API requests
    async makeRequest(endpoint, options = {}) {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const defaultOptions = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const requestOptions = {
                ...defaultOptions,
                ...options,
                headers: {
                    ...defaultOptions.headers,
                    ...options.headers,
                },
            };

            console.log(`🔄 Making API request to: ${url}`);
            
            const response = await fetch(url, requestOptions);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            console.log(`✅ API request successful`);
            return data;

        } catch (error) {
            console.error(`❌ API request failed:`, error);
            throw error;
        }
    }

    // Verify password and get encrypted link
    async verifyPassword(password, gameVersion = 'default') {
        return await this.makeRequest('/verify-password', {
            method: 'POST',
            body: JSON.stringify({
                password: password,
                gameVersion: gameVersion
            })
        });
    }

    // Verify encrypted link
    async verifyLink(encryptedLink) {
        return await this.makeRequest('/verify-link', {
            method: 'POST',
            body: JSON.stringify({
                encryptedLink: encryptedLink
            })
        });
    }

    // Get available game versions
    async getGameVersions() {
        return await this.makeRequest('/game-versions', {
            method: 'GET'
        });
    }

    // Health check
    async healthCheck() {
        return await this.makeRequest('/health', {
            method: 'GET'
        });
    }

    // Update base URL (useful for switching between local and production)
    setBaseURL(url) {
        this.baseURL = url;
        console.log(`🔧 API base URL updated to: ${this.baseURL}`);
    }
}

// Create global instance
const secureAPI = new SecureAPI();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecureAPI;
}

