#!/usr/bin/env node

/**
 * Trello API Proxy - CLI Entry Point
 * Provides a markdown-based interface to Trello data
 */

import dotenv from 'dotenv';
import { boardFromUrl, TrelloConnection, TrelloBoard } from './src/index.js';

// Load environment variables
dotenv.config();

/**
 * Show help information
 */
function showHelp() {
    console.log(`
Trello API Proxy CLI

Usage:
  trello-proxy list <board-url>                           List all lists in a board
  trello-proxy tasks <board-url>                          Get all task names in a board  
  trello-proxy tasks-in-list <board-url> <list-name>      Get task names from a specific list
  trello-proxy create <board-url> <list-name> <title>     Create a new task
  trello-proxy comment <task-id> <comment>                Add a comment to a task
  trello-proxy complete <task-id>                         Mark a task as completed
  trello-proxy first-open <board-url> <list-name>         Get first open task from a list
  trello-proxy archive <task-id>                          Archive a task
  trello-proxy move <task-id> <target-list>               Move a task to another list
  trello-proxy --help                                     Show this help message

Environment Variables:
  TRELLO_API_KEY    Your Trello API key (required)
  TRELLO_TOKEN      Your Trello API token (required)

Examples:
  trello-proxy list https://trello.com/b/abc123/my-board
  trello-proxy tasks https://trello.com/b/abc123/my-board
  trello-proxy tasks-in-list https://trello.com/b/abc123/my-board "ToDo"
  trello-proxy create https://trello.com/b/abc123/my-board "ToDo" "New task title"
  trello-proxy comment 5f3d4a2b8f9e1234567890ab "This is my comment"
  trello-proxy complete 5f3d4a2b8f9e1234567890ab
  trello-proxy first-open https://trello.com/b/abc123/my-board "ToDo"
  trello-proxy archive 5f3d4a2b8f9e1234567890ab
  trello-proxy move 5f3d4a2b8f9e1234567890ab "Done"
`);
}

async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
        showHelp();
        return;
    }
    
    try {
        const command = args[0];
        
        switch (command) {
            case 'list':
                if (args.length < 2) {
                    console.error('Error: Please provide a board URL');
                    process.exit(1);
                }
                const board1 = await boardFromUrl(args[1]);
                const lists = await board1.getLists();
                console.log(lists);
                break;
                
            case 'tasks':
                if (args.length < 2) {
                    console.error('Error: Please provide a board URL');
                    process.exit(1);
                }
                const board2 = await boardFromUrl(args[1]);
                const allTasks = await board2.getAllTaskNames();
                console.log(allTasks);
                break;
                
            case 'tasks-in-list':
                if (args.length < 3) {
                    console.error('Error: Please provide a board URL and list name');
                    process.exit(1);
                }
                const board3 = await boardFromUrl(args[1]);
                const listName = args[2];
                const tasks = await board3.getTaskNames(listName);
                console.log(tasks);
                break;
                
            case 'create':
                if (args.length < 4) {
                    console.error('Error: Please provide a board URL, list name, and task title');
                    process.exit(1);
                }
                const board4 = await boardFromUrl(args[1]);
                const targetListName = args[2];
                const taskTitle = args.slice(3).join(' ');
                
                // Get list ID from name
                const listsData = await board4.connection.makeRequest(`boards/${board4.boardId}/lists`, { fields: 'id,name' });
                const targetList = listsData.find(list => list.name === targetListName);
                
                if (!targetList) {
                    console.error(`Error: List "${targetListName}" not found`);
                    process.exit(1);
                }
                
                const newTask = await board4.createTask(targetList.id, {
                    name: taskTitle,
                    desc: `Created via Trello API Proxy CLI`
                });
                console.log(newTask);
                break;
                
            case 'comment':
                if (args.length < 3) {
                    console.error('Error: Please provide a task ID and comment text');
                    process.exit(1);
                }
                const taskId1 = args[1];
                const commentText = args.slice(2).join(' ');
                
                // We need to get the board from the task
                // For now, we'll use the default board - in a real implementation,
                // you might want to store board context or pass board URL
                const defaultBoardUrl = 'https://trello.com/b/cHkkifBS/trello-api-proxy-tasts';
                const board5 = await boardFromUrl(defaultBoardUrl);
                
                const commentResult = await board5.commentTask(taskId1, commentText);
                console.log(commentResult);
                break;
                
            case 'complete':
                if (args.length < 2) {
                    console.error('Error: Please provide a task ID');
                    process.exit(1);
                }
                const taskId2 = args[1];
                const board6 = await boardFromUrl('https://trello.com/b/cHkkifBS/trello-api-proxy-tasts');
                const completeResult = await board6.markTaskCompleted(taskId2);
                console.log(completeResult);
                break;
                
            case 'first-open':
                if (args.length < 3) {
                    console.error('Error: Please provide a board URL and list name');
                    process.exit(1);
                }
                const board7 = await boardFromUrl(args[1]);
                const listName2 = args[2];
                const firstOpen = await board7.getFirstOpenTask(listName2);
                console.log(firstOpen);
                break;
                
            case 'archive':
                if (args.length < 2) {
                    console.error('Error: Please provide a task ID');
                    process.exit(1);
                }
                const taskId3 = args[1];
                const board8 = await boardFromUrl('https://trello.com/b/cHkkifBS/trello-api-proxy-tasts');
                const archiveResult = await board8.archiveTask(taskId3);
                console.log(archiveResult);
                break;
                
            case 'move':
                if (args.length < 3) {
                    console.error('Error: Please provide a task ID and target list name');
                    process.exit(1);
                }
                const taskId4 = args[1];
                const targetListName2 = args[2];
                const board9 = await boardFromUrl('https://trello.com/b/cHkkifBS/trello-api-proxy-tasts');
                const moveResult = await board9.moveTask(taskId4, targetListName2);
                console.log(moveResult);
                break;
                
            default:
                console.error(`Unknown command: ${command}`);
                console.error('Run "trello-proxy --help" for usage information');
                process.exit(1);
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

// Re-export everything from src/index.js
export { boardFromUrl, TrelloConnection, TrelloBoard } from './src/index.js';

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}