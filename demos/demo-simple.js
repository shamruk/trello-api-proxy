#!/usr/bin/env node

import { boardFromUrl } from '../trello-proxy.js';

async function main() {
    try {
        // Super simple usage - just pass a URL!
        const boardUrl = 'https://trello.com/b/cHkkifBS/trello-api-proxy-tasts';
        const board = await boardFromUrl(boardUrl);
        
        console.log('Simplified Trello API Usage Demo\n');
        console.log('Board URL:', boardUrl, '\n');
        
        // Get lists
        console.log(await board.getLists());
        
        // Get all task names
        console.log(await board.getAllTaskNames());
        
        // Get task names from specific list
        console.log('\nGetting task names from "ToDo" list:');
        console.log(await board.getTaskNames('ToDo'));
        
        // Get first open task from a list
        console.log('\nGetting first open task from "ToDo" list:');
        console.log(await board.getFirstOpenTask('ToDo'));
        
        // Get specific task details if needed
        const taskId = '685f1bb73f21f8cc53d5a586'; // "Add create task/card method"
        console.log(await board.getTask(taskId));
        
        // Example: Add a comment to a task
        console.log('\nAdding a comment to a task:');
        try {
            const commentResult = await board.commentTask(
                taskId,
                'This is a demo comment added via the API!'
            );
            console.log(commentResult);
        } catch (error) {
            console.log('Note: Comment feature requires write permissions');
        }
        
        // Example: Mark a task as completed
        console.log('\nMarking a task as completed:');
        try {
            // Create a test task first to mark as completed
            const lists = await board.connection.makeRequest(`boards/${board.boardId}/lists`, { fields: 'id,name' });
            const todoList = lists.find(list => list.name === 'ToDo');
            
            const newTask = await board.createTask(todoList.id, {
                name: 'Demo task to mark as completed',
                desc: 'This task will be marked as completed',
                due: new Date(Date.now() + 24*60*60*1000).toISOString()
            });
            
            // Extract task ID from the markdown
            const newTaskIdMatch = newTask.match(/- \*\*ID\*\*: `([^`]+)`/);
            const newTaskId = newTaskIdMatch ? newTaskIdMatch[1] : null;
            
            if (newTaskId) {
                const completedResult = await board.markTaskCompleted(newTaskId);
                console.log(completedResult);
            }
        } catch (error) {
            console.log('Note: Mark completed feature requires write permissions');
        }
        
        // Example: Move a task to another list
        console.log('\nMoving a task to another list:');
        try {
            const moveTestTask = await board.createTask(todoList.id, {
                name: 'Demo task to move',
                desc: 'This task will be moved to Done list'
            });
            
            const moveTaskIdMatch = moveTestTask.match(/- \*\*ID\*\*: `([^`]+)`/);
            const moveTaskId = moveTaskIdMatch ? moveTaskIdMatch[1] : null;
            
            if (moveTaskId) {
                const moveResult = await board.moveTask(moveTaskId, 'Done');
                console.log(moveResult);
            }
        } catch (error) {
            console.log('Note: Move task feature requires write permissions');
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();