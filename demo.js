#!/usr/bin/env node

import { TrelloAccount, TrelloBoard } from './trello-proxy.js';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    const apiKey = process.env.TRELLO_API_KEY;
    const token = process.env.TRELLO_TOKEN;
    
    if (!apiKey || !token) {
        console.log('Please set TRELLO_API_KEY and TRELLO_TOKEN environment variables');
        return;
    }
    
    // Create TrelloAccount instance
    const account = new TrelloAccount(apiKey, token);
    
    try {
        console.log('Testing new refactored API...\n');
        
        // Get all boards
        console.log('Getting boards...');
        console.log(await account.getBoards());
        
        // Test getBoardByUrl with the trello-api-proxy-tasts board
        const boardUrl = 'https://trello.com/b/685f1a6eea6a274a8a412416/trello-api-proxy-tasts';
        console.log(`\nGetting board from URL: ${boardUrl}`);
        
        const board = account.getBoardByUrl(boardUrl);
        console.log('Board ID extracted:', board.boardId);
        
        // Get lists in the board
        console.log('\nGetting lists...');
        console.log(await board.getLists());
        
        // Get tasks in the board
        console.log('\nGetting tasks...');
        console.log(await board.getTasks());
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();