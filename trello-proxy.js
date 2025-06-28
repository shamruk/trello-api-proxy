#!/usr/bin/env node

/**
 * Trello API Proxy - CLI Entry Point
 * Demonstrates usage of the Trello API proxy
 */

import dotenv from 'dotenv';
import { boardFromUrl, TrelloConnection, TrelloBoard } from './src/index.js';

// Load environment variables
dotenv.config();

/**
 * Example usage of the Trello proxy
 */
async function main() {
    try {
        // Primary method: Use boardFromUrl for simple access
        console.log('=== Using boardFromUrl (recommended) ===\n');
        
        const boardUrl = 'https://trello.com/b/cHkkifBS/trello-api-proxy-tasts';
        const board = await boardFromUrl(boardUrl);
        
        console.log('Board loaded from URL:', boardUrl);
        console.log('\nLists in board:');
        console.log(await board.getLists());
        
        console.log('\nTasks in "ToDo" list:');
        console.log(await board.getTasks('ToDo'));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Re-export everything from src/index.js
export { boardFromUrl, TrelloConnection, TrelloBoard } from './src/index.js';

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}