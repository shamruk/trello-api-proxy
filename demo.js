#!/usr/bin/env node

/**
 * Demo script to show all TrelloProxy methods in action
 */

import TrelloProxy from './trello-proxy.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
    // Initialize proxy
    const apiKey = process.env.TRELLO_API_KEY;
    const token = process.env.TRELLO_TOKEN;
    const boardId = process.env.TRELLO_BOARD_ID;
    
    const proxy = new TrelloProxy(apiKey, token);
    
    console.log('='.repeat(80));
    console.log('NODE.JS TRELLO API PROXY DEMO');
    console.log('='.repeat(80));
    
    try {
        // 1. Get all boards
        console.log('\n1. GET ALL BOARDS');
        console.log('-'.repeat(40));
        const boards = await proxy.getBoards();
        console.log(boards);
        
        // 2. Get lists in board
        console.log('\n2. GET LISTS IN BOARD');
        console.log('-'.repeat(40));
        const lists = await proxy.getLists(boardId);
        console.log(lists);
        
        // 3. Get cards in board
        console.log('\n3. GET CARDS IN BOARD');
        console.log('-'.repeat(40));
        const cards = await proxy.getCards(boardId);
        console.log(cards);
        
        // 4. Get detailed card info (if there are cards)
        console.log('\n4. GET CARD DETAILS');
        console.log('-'.repeat(40));
        // First, get cards to find a card ID
        const cardsData = await proxy.makeRequest(`boards/${boardId}/cards`, { fields: 'id,name', limit: '1' });
        if (cardsData.length > 0) {
            const cardId = cardsData[0].id;
            const cardDetails = await proxy.getCard(cardId);
            console.log(cardDetails);
        } else {
            console.log('No cards found in the board to show details');
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();