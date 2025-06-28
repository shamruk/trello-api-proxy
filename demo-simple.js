#!/usr/bin/env node

import { boardFromUrl } from './trello-proxy.js';

async function main() {
    try {
        // Super simple usage - just pass a URL!
        const boardUrl = 'https://trello.com/b/cHkkifBS/trello-api-proxy-tasts';
        const board = await boardFromUrl(boardUrl);
        
        console.log('Simplified Trello API Usage Demo\n');
        console.log('Board URL:', boardUrl, '\n');
        
        // Get lists
        console.log(await board.getLists());
        
        // Get all cards
        console.log(await board.getAllCards());
        
        // Get cards from specific list
        console.log('\nGetting cards from "ToDo" list:');
        console.log(await board.getCards('ToDo'));
        
        // Get specific card details if needed
        const cardId = '685f1bb73f21f8cc53d5a586'; // "Add create task/card method"
        console.log(await board.getCard(cardId));
        
        // Example: Add a comment to a card
        console.log('\nAdding a comment to a card:');
        try {
            const commentResult = await board.commentCard(
                cardId,
                'This is a demo comment added via the API!'
            );
            console.log(commentResult);
        } catch (error) {
            console.log('Note: Comment feature requires write permissions');
        }
        
        // Example: Mark a card as completed
        console.log('\nMarking a card as completed:');
        try {
            // Create a test card first to mark as completed
            const lists = await board.connection.makeRequest(`boards/${board.boardId}/lists`, { fields: 'id,name' });
            const todoList = lists.find(list => list.name === 'ToDo');
            
            const newCard = await board.createCard(todoList.id, {
                name: 'Demo card to mark as completed',
                desc: 'This card will be marked as completed'
            });
            
            // Extract card ID from the markdown
            const newCardIdMatch = newCard.match(/- \*\*ID\*\*: `([^`]+)`/);
            const newCardId = newCardIdMatch ? newCardIdMatch[1] : null;
            
            if (newCardId) {
                const completedResult = await board.markCardCompleted(newCardId);
                console.log(completedResult);
            }
        } catch (error) {
            console.log('Note: Mark completed feature requires write permissions');
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();