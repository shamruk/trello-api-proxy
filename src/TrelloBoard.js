/**
 * TrelloBoard - Handles board-specific operations
 */

class TrelloBoard {
    /**
     * Initialize Trello Board
     * @param {TrelloAccount} account - TrelloAccount instance
     * @param {string} boardId - Board ID
     */
    constructor(account, boardId) {
        this.account = account;
        this.boardId = boardId;
    }

    /**
     * Get all lists in this board
     * @returns {Promise<string>} Markdown formatted list with id and name only
     */
    async getLists() {
        const lists = await this.account.makeRequest(`boards/${this.boardId}/lists`, { fields: 'id,name' });
        
        let markdown = '# Lists in Board\n\n';
        for (const list of lists) {
            markdown += `## ${list.name}\n`;
            markdown += `- **ID**: \`${list.id}\`\n\n`;
        }
        
        return markdown;
    }

    /**
     * Get all cards in this board
     * @returns {Promise<string>} Markdown formatted list with id and name only
     */
    async getCards() {
        const cards = await this.account.makeRequest(`boards/${this.boardId}/cards`, { fields: 'id,name' });
        
        let markdown = '# Cards in Board\n\n';
        for (const card of cards) {
            markdown += `## ${card.name}\n`;
            markdown += `- **ID**: \`${card.id}\`\n\n`;
        }
        
        return markdown;
    }

    /**
     * Get detailed information about a specific card
     * @param {string} cardId - Card ID
     * @returns {Promise<string>} Markdown formatted card details
     */
    async getCard(cardId) {
        const card = await this.account.makeRequest(`cards/${cardId}`, {
            fields: 'id,name,desc,closed,due,dueComplete,dateLastActivity,idBoard,idList,pos,shortUrl,labels,badges',
            attachments: 'true',
            attachment_fields: 'id,name,url,bytes,date',
            checklists: 'all',
            checklist_fields: 'id,name,pos',
            checkItem_fields: 'id,name,pos,state',
            actions: 'commentCard',
            actions_limit: '10'
        });
        
        let markdown = `# Card: ${card.name}\n\n`;
        markdown += `- **ID**: \`${card.id}\`\n`;
        markdown += `- **Status**: ${card.closed ? 'Closed' : 'Open'}\n`;
        
        if (card.desc) {
            markdown += `\n## Description\n${card.desc}\n`;
        }
        
        if (card.due) {
            markdown += `\n## Due Date\n- **Due**: ${card.due}\n`;
            markdown += `- **Complete**: ${card.dueComplete ? 'Yes' : 'No'}\n`;
        }
        
        if (card.labels && card.labels.length > 0) {
            markdown += '\n## Labels\n';
            for (const label of card.labels) {
                markdown += `- ${label.name || 'Unnamed'} (${label.color || 'no color'})\n`;
            }
        }
        
        if (card.badges) {
            const badges = card.badges;
            markdown += '\n## Activity\n';
            markdown += `- **Comments**: ${badges.comments || 0}\n`;
            markdown += `- **Attachments**: ${badges.attachments || 0}\n`;
            markdown += `- **Checklist Items**: ${badges.checkItems || 0} (${badges.checkItemsChecked || 0} complete)\n`;
        }
        
        if (card.attachments && card.attachments.length > 0) {
            markdown += '\n## Attachments\n';
            for (const att of card.attachments) {
                markdown += `- [${att.name}](${att.url})`;
                if (att.bytes) {
                    const sizeMB = (att.bytes / (1024 * 1024)).toFixed(2);
                    markdown += ` (${sizeMB} MB)`;
                }
                markdown += '\n';
            }
        }
        
        if (card.checklists && card.checklists.length > 0) {
            markdown += '\n## Checklists\n';
            for (const checklist of card.checklists) {
                markdown += `\n### ${checklist.name}\n`;
                for (const item of checklist.checkItems || []) {
                    const check = item.state === 'complete' ? '✓' : '☐';
                    markdown += `- ${check} ${item.name}\n`;
                }
            }
        }
        
        if (card.actions && card.actions.length > 0) {
            markdown += '\n## Recent Comments\n';
            for (const action of card.actions) {
                if (action.type === 'commentCard') {
                    markdown += `\n**${action.memberCreator.fullName}** (${action.date}):\n`;
                    markdown += `> ${action.data.text}\n`;
                }
            }
        }
        
        markdown += `\n**URL**: ${card.shortUrl}\n`;
        
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
    async createCard(idList, options = {}) {
        if (!idList) {
            throw new Error('List ID is required to create a card');
        }
        
        // Build the request parameters
        const params = {
            idList,
            ...options
        };
        
        try {
            const card = await this.account.makeRequest('cards', params, 'POST');
            
            // Return a markdown formatted confirmation
            let markdown = `# Card Created Successfully\n\n`;
            markdown += `## ${card.name}\n`;
            markdown += `- **ID**: \`${card.id}\`\n`;
            markdown += `- **List ID**: \`${card.idList}\`\n`;
            
            if (card.desc) {
                markdown += `\n### Description\n${card.desc}\n`;
            }
            
            if (card.due) {
                markdown += `\n### Due Date\n${card.due}\n`;
            }
            
            if (card.url) {
                markdown += `\n**URL**: ${card.url}\n`;
            } else if (card.shortUrl) {
                markdown += `\n**URL**: ${card.shortUrl}\n`;
            }
            
            return markdown;
        } catch (error) {
            throw new Error(`Failed to create card: ${error.message}`);
        }
    }
}

export default TrelloBoard;