/**
 * TrelloConnection - Handles authentication and base API requests
 */

import axios from 'axios';

class TrelloConnection {
    /**
     * Initialize Trello Connection with authentication
     * @param {string} apiKey - Trello API key
     * @param {string} token - Trello API token
     */
    constructor(apiKey, token) {
        this.apiKey = apiKey;
        this.token = token;
        this.baseUrl = 'https://api.trello.com/1/';
        this.authParams = {
            key: this.apiKey,
            token: this.token
        };
    }

    /**
     * Make authenticated request to Trello API
     * @param {string} endpoint - API endpoint
     * @param {Object} params - Additional query parameters
     * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
     * @param {Object} data - Request body data for POST/PUT requests
     * @returns {Promise<any>} API response data
     */
    async makeRequest(endpoint, params = {}, method = 'GET', data = null) {
        const url = `${this.baseUrl}${endpoint}`;
        const requestParams = { ...this.authParams, ...params };
        
        try {
            const config = {
                method: method,
                url: url,
                params: requestParams
            };
            
            if ((method === 'POST' || method === 'PUT') && data) {
                config.data = data;
            }
            
            const response = await axios(config);
            return response.data;
        } catch (error) {
            throw new Error(`Trello API error: ${error.message}`);
        }
    }

    /**
     * Get all boards accessible to the authenticated user
     * @returns {Promise<string>} Markdown formatted list with id and name only
     */
    async getBoards() {
        const boards = await this.makeRequest('members/me/boards', { fields: 'id,name' });
        
        let markdown = '# Trello Boards\n\n';
        for (const board of boards) {
            markdown += `## ${board.name}\n`;
            markdown += `- **ID**: \`${board.id}\`\n\n`;
        }
        
        return markdown;
    }

}

export default TrelloConnection;