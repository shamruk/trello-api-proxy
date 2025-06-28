/**
 * TrelloBoard - Handles board-specific operations
 */

class TrelloBoard {
    /**
     * Initialize Trello Board
     * @param {TrelloConnection} connection - TrelloConnection instance
     * @param {string} boardId - Board ID
     */
    constructor(connection, boardId) {
        this.connection = connection;
        this.boardId = boardId;
    }

    /**
     * Extract board ID from Trello board URL
     * @param {string} url - Trello board URL
     * @returns {string} Board ID
     * @private
     */
    static extractBoardIdFromUrl(url) {
        const match = url.match(/trello\.com\/b\/([a-zA-Z0-9]+)/);
        if (!match) {
            throw new Error('Invalid Trello board URL');
        }
        return match[1];
    }

    /**
     * Create TrelloBoard instance from URL
     * @param {string} url - Trello board URL
     * @param {TrelloConnection} connection - TrelloConnection instance
     * @returns {TrelloBoard} TrelloBoard instance
     */
    static fromUrl(url, connection) {
        const boardId = TrelloBoard.extractBoardIdFromUrl(url);
        return new TrelloBoard(connection, boardId);
    }

    /**
     * Get all lists in this board
     * @returns {Promise<string>} Markdown formatted list with id and name only
     */
    async getLists() {
        const lists = await this.connection.makeRequest(`boards/${this.boardId}/lists`, { fields: 'id,name' });
        
        let markdown = '# Lists in Board\n\n';
        for (const list of lists) {
            markdown += `## ${list.name}\n`;
            markdown += `- **ID**: \`${list.id}\`\n\n`;
        }
        
        return markdown;
    }

    /**
     * Get all task names and IDs in this board
     * @returns {Promise<string>} Markdown formatted list with id and name only
     */
    async getAllTaskNames() {
        const tasks = await this.connection.makeRequest(`boards/${this.boardId}/cards`, { fields: 'id,name' });
        
        let markdown = '# Tasks in Board\n\n';
        for (const task of tasks) {
            markdown += `## ${task.name}\n`;
            markdown += `- **ID**: \`${task.id}\`\n\n`;
        }
        
        return markdown;
    }

    /**
     * Get task names and IDs from a specific list
     * @param {string} listName - Name of the list
     * @returns {Promise<string>} Markdown formatted task names and IDs from the specified list
     */
    async getTaskNames(listName) {
        // First, get all lists to find the one with matching name
        const lists = await this.connection.makeRequest(`boards/${this.boardId}/lists`, { fields: 'id,name' });
        
        // Find the list with the specified name
        const targetList = lists.find(list => list.name === listName);
        
        if (!targetList) {
            throw new Error(`List "${listName}" not found in board`);
        }
        
        // Get tasks from the specific list
        const tasks = await this.connection.makeRequest(`lists/${targetList.id}/cards`, { fields: 'id,name' });
        
        let markdown = `# Tasks in "${listName}"\n\n`;
        if (tasks.length === 0) {
            markdown += '_No tasks in this list_\n';
        } else {
            for (const task of tasks) {
                markdown += `## ${task.name}\n`;
                markdown += `- **ID**: \`${task.id}\`\n\n`;
            }
        }
        
        return markdown;
    }

    /**
     * Get detailed information about a specific task
     * @param {string} taskId - Task ID
     * @returns {Promise<string>} Markdown formatted task details
     */
    async getTask(taskId) {
        const task = await this.connection.makeRequest(`cards/${taskId}`, {
            fields: 'id,name,desc,closed,due,dueComplete,dateLastActivity,idBoard,idList,pos,labels,badges',
            attachments: 'true',
            attachment_fields: 'id,name,url,bytes,date',
            checklists: 'all',
            checklist_fields: 'id,name,pos',
            checkItem_fields: 'id,name,pos,state',
            actions: 'commentCard',
            actions_limit: '10'
        });
        
        let markdown = `# Task: ${task.name}\n\n`;
        markdown += `- **ID**: \`${task.id}\`\n`;
        markdown += `- **Status**: ${task.closed ? 'Closed' : 'Open'}\n`;
        
        if (task.desc) {
            markdown += `\n## Description\n${task.desc}\n`;
        }
        
        if (task.due) {
            markdown += `\n## Due Date\n- **Due**: ${task.due}\n`;
            markdown += `- **Complete**: ${task.dueComplete ? 'Yes' : 'No'}\n`;
        }
        
        if (task.labels && task.labels.length > 0) {
            markdown += '\n## Labels\n';
            for (const label of task.labels) {
                markdown += `- ${label.name || 'Unnamed'} (${label.color || 'no color'})\n`;
            }
        }
        
        if (task.badges && (task.badges.comments || task.badges.attachments || task.badges.checkItems || task.badges.checkItemsChecked)) {
            const badges = task.badges;
            markdown += '\n## Activity\n';
            if (badges.comments) {
                markdown += `- **Comments**: ${badges.comments || 0}\n`;
            }
            if (badges.attachments) {
                markdown += `- **Attachments**: ${badges.attachments || 0}\n`;
            }
            if (badges.checkItems) {
                markdown += `- **Checklist Items**: ${badges.checkItems || 0} (${badges.checkItemsChecked || 0} complete)\n`;
            }
        }
        
        if (task.attachments && task.attachments.length > 0) {
            markdown += '\n## Attachments\n';
            for (const att of task.attachments) {
                markdown += `- [${att.name}](${att.url})`;
                if (att.bytes) {
                    const sizeMB = (att.bytes / (1024 * 1024)).toFixed(2);
                    markdown += ` (${sizeMB} MB)`;
                }
                markdown += '\n';
            }
        }
        
        if (task.checklists && task.checklists.length > 0) {
            markdown += '\n## Checklists\n';
            for (const checklist of task.checklists) {
                markdown += `\n### ${checklist.name}\n`;
                for (const item of checklist.checkItems || []) {
                    const check = item.state === 'complete' ? '✓' : '☐';
                    markdown += `- ${check} ${item.name}\n`;
                }
            }
        }
        
        if (task.actions && task.actions.length > 0) {
            markdown += '\n## Recent Comments\n';
            for (const action of task.actions) {
                if (action.type === 'commentCard') {
                    markdown += `\n**${action.memberCreator.fullName}** (${action.date}):\n`;
                    markdown += `> ${action.data.text}\n`;
                }
            }
        }
        
        // markdown += `\n**URL**: ${task.shortUrl}\n`;
        
        return markdown;
    }

    /**
     * Create a new card in a list
     * @param {string} idList - The ID of the list to add the card to
     * @param {Object} options - Card options
     * @param {string} options.name - Name of the card
     * @param {string} [options.desc] - Description of the card
     * @param {string} [options.pos] - Position of the card in the list ('top', 'bottom', or a number)
     * @param {string} [options.due] - Due date as ISO string
     * @param {Array<string>} [options.idMembers] - Array of member IDs to assign
     * @param {Array<string>} [options.idLabels] - Array of label IDs to add
     * @returns {Promise<string>} Markdown formatted confirmation with card details
     */
    async createTask(idList, options = {}) {
        if (!idList) {
            throw new Error('List ID is required to create a task');
        }
        
        // Build the request parameters
        const params = {
            idList,
            ...options
        };
        
        try {
            const task = await this.connection.makeRequest('cards', params, 'POST');
            
            // Return a markdown formatted confirmation
            let markdown = `# Task Created Successfully\n\n`;
            markdown += `- **ID**: \`${task.id}\`\n`;
            return markdown;
        } catch (error) {
            throw new Error(`Failed to create task: ${error.message}`);
        }
    }

    /**
     * Add a comment to a task
     * @param {string} taskId - The ID of the task to comment on
     * @param {string} text - The comment text
     * @returns {Promise<string>} Markdown formatted confirmation
     */
    async commentTask(taskId, text) {
        if (!taskId) {
            throw new Error('Task ID is required to add a comment');
        }
        
        if (!text) {
            throw new Error('Comment text is required');
        }
        
        try {
            await this.connection.makeRequest(`cards/${taskId}/actions/comments`, { text }, 'POST');
            
            // Return a markdown formatted confirmation
            return `# Comment Added Successfully\n\n`;            
        } catch (error) {
            throw new Error(`Failed to add comment: ${error.message}`);
        }
    }

    /**
     * Mark a task as completed (sets dueComplete to true)
     * @param {string} taskId - The ID of the task to mark as completed
     * @returns {Promise<string>} Markdown formatted confirmation
     */
    async markTaskCompleted(taskId) {
        if (!taskId) {
            throw new Error('Task ID is required to mark as completed');
        }
        try {
            await this.connection.makeRequest(`cards/${taskId}`, { dueComplete: true }, 'PUT');
            return `# Task Marked as Completed\n\n`;
        } catch (error) {
            throw new Error(`Failed to mark task as completed: ${error.message}`);
        }
    }

    /**
     * Get the first open task from a specific list
     * An open task is one that is not archived (closed=false) AND not marked as due complete
     * @param {string} listName - Name of the list to search in
     * @returns {Promise<string>} Markdown formatted task details or message if no open tasks
     */
    async getFirstOpenTask(listName) {
        // First, get all lists to find the one with matching name
        const lists = await this.connection.makeRequest(`boards/${this.boardId}/lists`, { fields: 'id,name' });
        
        // Find the list with the specified name
        const targetList = lists.find(list => list.name === listName);
        
        if (!targetList) {
            throw new Error(`List "${listName}" not found in board`);
        }
        
        // Get all non-archived cards from the specific list with necessary fields
        const tasks = await this.connection.makeRequest(`lists/${targetList.id}/cards`, { 
            fields: 'id,name,closed,dueComplete',
            filter: 'open'  // This filter returns non-archived cards (closed=false)
        });
        
        // Filter to find tasks that are not dueComplete
        const openTasks = tasks.filter(task => !task.dueComplete);
        
        if (openTasks.length === 0) {
            return `# No Open Tasks in "${listName}"\n\n_All tasks in this list are either completed or archived._\n`;
        }
        
        // Get the first open task and return its details
        const firstOpenTask = openTasks[0];
        return await this.getTask(firstOpenTask.id);
    }

    async archiveTask(taskId) {
        if (!taskId) {
            throw new Error('Task ID is required to archive');
        }
        try {
            await this.connection.makeRequest(`cards/${taskId}`, { closed: true }, 'PUT');
            return `# Archived Task\n\n`;
        } catch (error) {
            throw new Error(`Failed to archive task: ${error.message}`);
        }
    }

    /**
     * Move a task to another list
     * @param {string} taskId - The ID of the task to move
     * @param {string} targetListName - The name of the list to move the task to
     * @returns {Promise<string>} Markdown formatted confirmation
     */
    async moveTask(taskId, targetListName) {
        if (!taskId) {
            throw new Error('Task ID is required to move');
        }
        
        if (!targetListName) {
            throw new Error('Target list name is required');
        }
        
        try {
            // First, get all lists to find the target list ID
            const lists = await this.connection.makeRequest(`boards/${this.boardId}/lists`, { fields: 'id,name' });
            
            // Find the target list
            const targetList = lists.find(list => list.name === targetListName);
            
            if (!targetList) {
                throw new Error(`List "${targetListName}" not found in board`);
            }
            
            // Move the task by updating its idList
            await this.connection.makeRequest(
                `cards/${taskId}`,
                { idList: targetList.id },
                'PUT'
            );
            
            // Get task details for confirmation
            const task = await this.connection.makeRequest(`cards/${taskId}`, { fields: 'name' });
            
            return `# Task Moved Successfully\n\n## ${task.name}\n- **Task ID**: \`${taskId}\`\n- **Moved to**: ${targetListName}\n- **New List ID**: \`${targetList.id}\`\n`;
        } catch (error) {
            throw new Error(`Failed to move task: ${error.message}`);
        }
    }
}

export default TrelloBoard;