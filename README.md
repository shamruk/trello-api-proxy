# Trello API Proxy - Node.js Implementation

A simplified Trello API proxy that returns data in markdown format optimized for LLM consumption.

## Examples

### How to get tasks from a list
```
      import { boardFromUrl } from './trello-proxy.js';
      const boardUrl = YOUR_BOARD_URL;
      const board = await boardFromUrl(boardUrl);
      const todoTasks = await board.getTasks(TARGET_LIST_NAME);
```      

## Features

- **Get Boards**: Retrieve all accessible boards (id and name only)
- **Get Lists**: Retrieve all lists in a board (id and name only)  
- **Get Tasks**: Retrieve all tasks in a board (id and name only)
- **Get Task Details**: Retrieve detailed task information excluding members and permissions
- **Create Task**: Create new tasks in a list with optional description, due date, and position


## Usage

### As a Module

```javascript
import TrelloProxy from './trello-proxy.js';

// Initialize proxy
const proxy = new TrelloProxy('your-key', 'your-token');

// Get all boards
const boardsMd = await proxy.getBoards();
console.log(boardsMd);

// Get lists in a board
const listsMd = await proxy.getLists('board-id');
console.log(listsMd);

// Get tasks in a board
const tasksMd = await proxy.getTasks('board-id');
console.log(tasksMd);

// Get detailed task information
const taskMd = await proxy.getTask('task-id');
console.log(taskMd);

// Create a new task
const newTaskMd = await proxy.createTask('list-id', {
    name: 'My New Task',
    desc: 'Task description',
    pos: 'bottom',
    due: '2024-12-31T23:59:59.000Z'
});
console.log(newTaskMd);
```

### Command Line

```bash
node trello-proxy.js
```

## Response Format

All responses are formatted in markdown for easy LLM consumption:

### Boards Response Example

```markdown
# Trello Boards

## My Project Board
- **ID**: `abc123def456`

## Personal Tasks
- **ID**: `xyz789ghi012`
```

### Task Details Response Example

```markdown
# Task: Implement new feature

- **ID**: `card123`
- **Status**: Open

## Description
This task tracks the implementation of the new user dashboard feature.

## Due Date
- **Due**: 2024-12-31T23:59:59.000Z
- **Complete**: No

## Labels
- High Priority (red)
- Frontend (blue)

## Activity
- **Comments**: 3
- **Attachments**: 2
- **Checklist Items**: 5 (3 complete)

## Checklists

### Implementation Tasks
- ✓ Design mockup
- ✓ Set up components
- ☐ Implement API calls
- ☐ Add tests

## Recent Comments

**John Doe** (2024-01-15T10:30:00.000Z):
> Started working on the mockup design

**URL**: https://trello.com/c/card123
```

## API Methods

### `async getBoards()`
Returns all accessible boards with their IDs and names in markdown format.

### `async getLists(boardId)`
Returns all lists in a specified board with their IDs and names.

### `async getTasks(boardId)`
Returns all tasks in a specified board with their IDs and names.

### `async getTask(taskId)`
Returns detailed information about a specific task including:
- Basic info (id, name, status)
- Description
- Due date and completion status
- Labels
- Activity badges (comments, attachments, checklist progress)
- Attachments with file sizes
- Checklists with item completion status
- Recent comments (last 10)
- Short URL to the task

### `async createTask(idList, options)`
Creates a new task in the specified list and returns a markdown confirmation.

**Parameters:**
- `idList` (required) - The ID of the list to add the task to
- `options` (object) - Task creation options:
  - `name` (string) - Name of the task
  - `desc` (string, optional) - Description of the task
  - `pos` (string, optional) - Position in the list ('top', 'bottom', or a number)
  - `due` (string, optional) - Due date as ISO string
  - `idMembers` (array, optional) - Array of member IDs to assign
  - `idLabels` (array, optional) - Array of label IDs to add

**Returns:** Markdown formatted confirmation with the created task's ID and details.

## Error Handling

The proxy handles errors gracefully and throws descriptive error messages. Use try-catch blocks when calling methods:

```javascript
try {
    const boards = await proxy.getBoards();
    console.log(boards);
} catch (error) {
    console.error('Error:', error.message);
}
```

## Requirements

- Node.js >= 14.0.0
- npm or yarn

## Dependencies

- `axios` - For making HTTP requests
- `dotenv` - For loading environment variables