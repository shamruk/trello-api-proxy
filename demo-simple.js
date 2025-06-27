#!/usr/bin/env node

import TrelloProxy from './trello-proxy.js';

async function main() {
    try {
        // Super simple usage - just pass a URL!
        const boardUrl = 'https://trello.com/b/cHkkifBS/trello-api-proxy-tasts';
        const board = await TrelloProxy.boardFromUrl(boardUrl);
        
        console.log('Simplified Trello API Usage Demo\n');
        console.log('Board URL:', boardUrl, '\n');
        
        // Get lists
        console.log(await board.getLists());
        
        // Get cards
        console.log(await board.getCards());
        
        // Get specific card details if needed
        const cardId = '685f1bb73f21f8cc53d5a586'; // "Add create task/card method"
        console.log(await board.getCard(cardId));
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();