# Trello API Proxy

A Node.js module and CLI tool that provides simplified access to Trello data in markdown format, optimized for LLM consumption.

## Quick Start

### CLI Usage

```bash
# List all lists in a board
trello-proxy list https://trello.com/b/YOUR_BOARD_ID/board-name

# Get tasks from a specific list
trello-proxy tasks-in-list https://trello.com/b/YOUR_BOARD_ID/board-name "ToDo"

# Create a new task
trello-proxy create https://trello.com/b/YOUR_BOARD_ID/board-name "ToDo" "New task title"
```

### Module Usage

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

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd trello-api-proxy

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your TRELLO_API_KEY and TRELLO_TOKEN
```

## CLI Commands

```bash
trello-proxy list <board-url>                        # List all lists in a board
trello-proxy tasks <board-url>                       # Get all task names in a board  
trello-proxy tasks-in-list <board-url> <list-name>   # Get task names from a specific list
trello-proxy create <board-url> <list-name> <title>  # Create a new task
trello-proxy comment <task-id> <comment>             # Add a comment to a task
trello-proxy complete <task-id>                      # Mark a task as completed
trello-proxy first-open <board-url> <list-name>      # Get first open task from a list
trello-proxy archive <task-id>                       # Archive a task
trello-proxy move <task-id> <target-list>            # Move a task to another list
trello-proxy --help                                  # Show help message
```

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

## Environment Variables

Create a `.env` file with your Trello credentials:

```env
TRELLO_API_KEY=your_api_key_here
TRELLO_TOKEN=your_token_here
```

To get your Trello API credentials:
1. Get your API key from: https://trello.com/app-key
2. Generate a token using the link on the same page

## Running Demos

```bash
# Simple demo
node demos/demo-simple.js

# Full demo (if working)
node demos/demo.js
```

## License

MIT