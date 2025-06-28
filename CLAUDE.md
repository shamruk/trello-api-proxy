# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Running and Testing
- `npm start` - Run the proxy directly (executes demo when called as CLI)
- `npm test` - Run Jest tests with ES module support
- `node trello-proxy.js` - Run as CLI tool (executes demo)
- `node demo.js` - Run the demonstration script

### Development Workflow
1. Set up environment: Copy `.env.example` to `.env` and add Trello API credentials
2. Install dependencies: `npm install`
3. Test changes: `npm test` (note: unit tests are skipped due to ESM mocking limitations, integration tests require real credentials)

## Architecture Overview

This is a single-module Node.js ES module implementation of a Trello API proxy designed to return markdown-formatted data optimized for LLM consumption.

### Core Design Principles
1. **Markdown Output**: All API responses are converted to structured markdown rather than JSON, making them easier for LLMs to parse and understand
2. **Minimal Data Transfer**: API calls specify exact fields needed (typically just `id` and `name` for lists)
3. **Simple Class-Based Design**: Single `TrelloProxy` class encapsulates all functionality

### Key Components
- **`trello-proxy.js`**: Main module exporting `TrelloProxy` class
  - Constructor takes API key and token
  - Four main methods: `getBoards()`, `getLists(boardId)`, `getTasks(boardId)`, `getTask(taskId)`
  - Can be run directly as CLI (executes demo)
  
- **`demo.js`**: Demonstration script showing all proxy methods in action

### API Method Patterns
All methods follow a consistent pattern:
1. Build Trello API URL with appropriate query parameters
2. Make authenticated GET request using axios
3. Transform JSON response to markdown format
4. Return markdown string

### Authentication
- Uses API key and token passed to constructor
- Credentials loaded from `.env` file when run as CLI
- All API calls include `key` and `token` query parameters

### Testing Approach
- Jest with ES module support (`--experimental-vm-modules`)
- Integration tests test real API calls (require valid credentials)
- Unit tests currently skipped due to ESM mocking limitations

### Error Handling
- All API calls wrapped in try-catch blocks
- Errors include descriptive messages about what operation failed
- HTTP errors preserved with status codes and response data

### Trello API
https://developer.atlassian.com/cloud/trello/rest/
Also note that dueComplete works on tasks without due date despite documentation 

@TASKS.md