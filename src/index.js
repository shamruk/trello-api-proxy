/**
 * Trello API Proxy - Main entry point
 * Exports all classes and provides convenient access methods
 */

import TrelloAccount from './TrelloAccount.js';
import TrelloBoard from './TrelloBoard.js';
import TrelloProxy from './TrelloProxy.js';

// Export individual classes
export { TrelloAccount, TrelloBoard, TrelloProxy };

// Export TrelloProxy as default for backward compatibility
export default TrelloProxy;