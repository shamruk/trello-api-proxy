/**
 * Trello API Proxy - Main entry point
 * Exports all classes and provides convenient access methods
 */

import TrelloAccount from './TrelloAccount.js';
import TrelloBoard from './TrelloBoard.js';
import dotenv from 'dotenv';

/**
 * Get TrelloBoard instance by URL with automatic credentials
 * This is the main entry point for the service
 * @param {string} url - Trello board URL
 * @returns {Promise<TrelloBoard>} TrelloBoard instance
 */
export async function boardFromUrl(url) {
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

// Export individual classes
export { TrelloAccount, TrelloBoard };

// No default export - use named exports