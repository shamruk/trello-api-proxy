#!/usr/bin/env node

/**
 * Trello API Proxy - CLI Entry Point
 * This file provides backward compatibility and CLI functionality
 */

import dotenv from 'dotenv';
import TrelloProxy, { TrelloAccount, TrelloBoard } from './src/index.js';

// Load environment variables
dotenv.config();

/**
 * Example usage of the Trello proxy
 */
async function main() {
    // Load credentials from environment
    const apiKey = process.env.TRELLO_API_KEY;
    const token = process.env.TRELLO_TOKEN;
    
    if (!apiKey || !token) {
        console.log('Please set TRELLO_API_KEY and TRELLO_TOKEN environment variables');
        return;
    }
    
    const proxy = new TrelloProxy(apiKey, token);
    
    try {
        // Example: Get all boards
        console.log(await proxy.getBoards());
        
        // Example: Get lists from a specific board
        // const boardId = 'YOUR_BOARD_ID';
        // console.log(await proxy.getLists(boardId));
        
        // Example: Get cards from a board
        // console.log(await proxy.getCards(boardId));
        
        // Example: Get detailed card info
        // const cardId = 'YOUR_CARD_ID';
        // console.log(await proxy.getCard(cardId));
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Re-export everything from src/index.js
export { TrelloAccount, TrelloBoard, TrelloProxy } from './src/index.js';
export default TrelloProxy;

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}