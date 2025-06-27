/**
 * TrelloProxy - Backward compatibility wrapper
 */

import TrelloAccount from './TrelloAccount.js';
import TrelloBoard from './TrelloBoard.js';
import dotenv from 'dotenv';

// Backward compatibility wrapper
class TrelloProxy {
    constructor(apiKey, token) {
        this.account = new TrelloAccount(apiKey, token);
    }

    async makeRequest(endpoint, params = {}, method = 'GET', data = null) {
        return this.account.makeRequest(endpoint, params, method, data);
    }

    async getBoards() {
        return this.account.getBoards();
    }

    async getLists(boardId) {
        const board = new TrelloBoard(this.account, boardId);
        return board.getLists();
    }

    async getCards(boardId) {
        const board = new TrelloBoard(this.account, boardId);
        return board.getCards();
    }

    async getCard(cardId) {
        const board = new TrelloBoard(this.account, 'dummy');
        return board.getCard(cardId);
    }

    async createCard(idList, options = {}) {
        const board = new TrelloBoard(this.account, 'dummy');
        return board.createCard(idList, options);
    }
    
    /**
     * Static method to get TrelloBoard by URL with automatic credentials
     * @param {string} url - Trello board URL
     * @returns {TrelloBoard} TrelloBoard instance
     */
    static async boardFromUrl(url) {
        // Load environment variables if not already loaded
        dotenv.config();
        
        const apiKey = process.env.TRELLO_API_KEY;
        const token = process.env.TRELLO_TOKEN;
        
        if (!apiKey || !token) {
            throw new Error('TRELLO_API_KEY and TRELLO_TOKEN must be set in environment variables');
        }
        
        const account = new TrelloAccount(apiKey, token);
        return await account.getBoardByUrl(url);
    }
}

export default TrelloProxy;