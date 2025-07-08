// Secure API Client for Rico World
// This replaces direct Firebase access with secure backend API calls

class SecureAPI {
    constructor() {
        this.baseURL = 'https://rico-secure-backend.onrender.com';
    }

    // Helper method to make API requests
    async makeRequest(endpoint, options = {}) {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const defaultOptions = {
                headers: { 'Content-Type': 'application/json' },
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
            body: JSON.stringify({ password, gameVersion }),
        });
    }

    // Verify encrypted link
    async verifyLink(encryptedLink) {
        return await this.makeRequest('/verify-link', {
            method: 'POST',
            body: JSON.stringify({ encryptedLink }),
        });
    }

    // Get available game versions
    async getGameVersions() {
        return await this.makeRequest('/game-versions', { method: 'GET' });
    }

    // Health check
    async healthCheck() {
        return await this.makeRequest('/health', { method: 'GET' });
    }

    // Update base URL
    setBaseURL(url) {
        this.baseURL = url;
        console.log(`🔧 API base URL updated to: ${this.baseURL}`);
    }
}

// Global instance
const secureAPI = new SecureAPI();
