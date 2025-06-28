# Trello API Proxy

A Node.js module that provides simplified access to Trello data in markdown format, optimized for LLM consumption.

## Quick Start

```javascript
import { boardFromUrl } from './trello-proxy.js';

const board = await boardFromUrl('YOUR_BOARD_URL');
const tasks = await board.getFirstOpenTask('ToDo');
console.log(tasks);
```

## Key Features

- Returns markdown-formatted responses instead of JSON
- Minimal data transfer (only essential fields)
- Simple, focused API with just the methods you need
- Built for LLM integration

## API Reference

### Board Methods

```javascript
const board = await boardFromUrl(boardUrl);

// Get all lists in the board
const lists = await board.getLists();

// Get all task names in the board
const allTaskNames = await board.getAllTaskNames();

// Get task names from a specific list
const todoTaskNames = await board.getTaskNames('ToDo');

// Get first open task from a list (not archived AND not dueComplete)
const firstOpenTask = await board.getFirstOpenTask('ToDo');

// Get detailed task information
const taskDetails = await board.getTask(taskId);

// Create a new task
const newTask = await board.createTask(listId, {
    name: 'Task name',
    desc: 'Description'
});

// Add a comment to a task
await board.commentTask(taskId, 'This is a comment');

// Mark task as completed
await board.markTaskCompleted(taskId);

// Archive a task
await board.archiveTask(taskId);

// Move a task to another list
await board.moveTask(taskId, 'Done');
```

## Response Examples

### Task List
```markdown
# Tasks in "ToDo"

## Implement feature X
- **ID**: `abc123`

## Fix bug Y
- **ID**: `def456`
```

### Task Details
```markdown
# Task: Implement feature X

- **ID**: `abc123`
- **Status**: Open

## Description
Implementation details here...

## Due Date
- **Due**: 2024-12-31T23:59:59.000Z
- **Complete**: No

**URL**: https://trello.com/c/abc123
```