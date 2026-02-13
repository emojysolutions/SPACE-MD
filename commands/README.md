# SPACE-MD Commands

This directory contains all bot commands organized by category.

## Directory Structure

```
commands/
├── music/           # Music-related commands
│   ├── play.js      # Download music by name or URL
│   └── search.js    # Search and pick from results
└── ...              # Other command categories
```

## Command Structure

Each command file should export an object with the following structure:

```javascript
module.exports = {
  name: 'commandname',           // Primary command name
  aliases: ['alias1', 'alias2'], // Alternative command names
  category: 'category',          // Command category
  description: 'Description',    // Brief description
  usage: '!command <args>',      // Usage format
  examples: ['example1'],        // Usage examples
  cooldown: 5,                   // Cooldown in seconds
  adminOnly: false,              // Whether admin-only
  
  execute: async (from, args, helpers) => {
    // Command implementation
    // from: sender ID
    // args: command arguments array
    // helpers: { sendMessage, sendAudio, sendDocument, etc. }
  }
};
```

## Music Commands

### play.js

Downloads music from YouTube by song name or direct URL.

**Triggers:** `!play`, `!music`, `!song`, `!yt`, `!youtube`, `!dl`

**Features:**
- Automatic YouTube search if not a URL
- Shows video details before downloading
- Converts to MP3 format (128kbps)
- 10-minute duration limit
- Auto-cleanup of temporary files

### search.js

Search YouTube and pick from top 3 results.

**Triggers:** `!search`, `!ytsearch`, `!find`

**Features:**
- Shows top 3 search results
- Displays title, channel, duration, and views
- 60-second session timeout
- Numeric selection (1-3)

**Selection Flow:**
1. User sends `!search Song Name`
2. Bot shows top 3 results
3. User replies with `1`, `2`, or `3`
4. Bot downloads selected result

## Integration

Commands are designed to be loaded by the main bot logic in `index.js`. The bot should:

1. Scan the `commands/` directory
2. Load all `.js` files
3. Register commands and their aliases
4. Handle cooldowns and permissions
5. Call `execute()` function when command is triggered

## Session Management

Commands use the `sessionManager` utility (in `utils/sessionManager.js`) for temporary data storage:

```javascript
const sessionManager = require('../../utils/sessionManager');

// Store data with auto-expiration
sessionManager.set(userId, 'key', data, ttlInMs);

// Retrieve data
const data = sessionManager.get(userId, 'key');

// Check if exists
if (sessionManager.has(userId, 'key')) { ... }

// Delete manually
sessionManager.delete(userId, 'key');
```

## Error Handling

All commands should:
- Validate input arguments
- Handle API/network errors gracefully
- Clean up resources (temp files, sessions)
- Return user-friendly error messages
- Log errors for debugging

## Dependencies

Music commands require:
- `ytdl-core` - YouTube downloader
- `ytsr` - YouTube search
- `fluent-ffmpeg` - Audio conversion
- `ffmpeg` binary installed on system
