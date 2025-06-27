# Trello API Proxy - Node.js Implementation

A simplified Trello API proxy that returns data in markdown format optimized for LLM consumption.

## Features

- **Get Boards**: Retrieve all accessible boards (id and name only)
- **Get Lists**: Retrieve all lists in a board (id and name only)  
- **Get Cards**: Retrieve all cards in a board (id and name only)
- **Get Card Details**: Retrieve detailed card information excluding members and permissions
- **Create Card**: Create new cards in a list with optional description, due date, and position

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file with your Trello credentials:

```bash
TRELLO_API_KEY=your-api-key
TRELLO_TOKEN=your-token
```

Get your API key from: https://trello.com/app-key

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

// Get cards in a board
const cardsMd = await proxy.getCards('board-id');
console.log(cardsMd);

// Get detailed card information
const cardMd = await proxy.getCard('card-id');
console.log(cardMd);

// Create a new card
const newCardMd = await proxy.createCard('list-id', {
    name: 'My New Card',
    desc: 'Card description',
    pos: 'bottom',
    due: '2024-12-31T23:59:59.000Z'
});
console.log(newCardMd);
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

### Card Details Response Example

```markdown
# Card: Implement new feature

- **ID**: `card123`
- **Status**: Open

## Description
This card tracks the implementation of the new user dashboard feature.

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

### `async getCards(boardId)`
Returns all cards in a specified board with their IDs and names.

### `async getCard(cardId)`
Returns detailed information about a specific card including:
- Basic info (id, name, status)
- Description
- Due date and completion status
- Labels
- Activity badges (comments, attachments, checklist progress)
- Attachments with file sizes
- Checklists with item completion status
- Recent comments (last 10)
- Short URL to the card

### `async createCard(idList, options)`
Creates a new card in the specified list and returns a markdown confirmation.

**Parameters:**
- `idList` (required) - The ID of the list to add the card to
- `options` (object) - Card creation options:
  - `name` (string) - Name of the card
  - `desc` (string, optional) - Description of the card
  - `pos` (string, optional) - Position in the list ('top', 'bottom', or a number)
  - `due` (string, optional) - Due date as ISO string
  - `idMembers` (array, optional) - Array of member IDs to assign
  - `idLabels` (array, optional) - Array of label IDs to add

**Returns:** Markdown formatted confirmation with the created card's ID and details.

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