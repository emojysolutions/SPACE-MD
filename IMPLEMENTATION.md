# YouTube Music Search Implementation Summary

This document summarizes the implementation of the YouTube music search feature for SPACE-MD bot.

## Overview

Added comprehensive YouTube music download functionality with two modes:
1. **Direct URL download** - Download music from a YouTube URL
2. **Search by song title** - Search YouTube and download music by song name

## Files Added

### Commands
- `commands/music/play.js` - Main music download command
- `commands/music/search.js` - Interactive search command
- `commands/README.md` - Command documentation

### Utilities
- `utils/sessionManager.js` - Session management with auto-expiration
- `utils/youtube.js` - YouTube search and download functions
- `utils/formatters.js` - Data formatting utilities

### Other
- `.gitignore` - Ignore build artifacts and temporary files
- `test/test-commands.js` - Validation tests for command structure

### Updated
- `package.json` - Added ytsr and ytdl-core dependencies
- `README.md` - Added feature documentation and legal disclaimer

## Dependencies Added

```json
{
  "ytdl-core": "^4.11.5",  // YouTube downloader
  "ytsr": "^3.8.4"          // YouTube search
}
```

## Commands

### !play <song name or URL>

**Aliases:** `!music`, `!song`, `!yt`, `!youtube`, `!dl`

**Features:**
- Automatic detection of URL vs search query
- YouTube search integration
- MP3 conversion at 128kbps
- 10-minute duration limit
- Automatic cleanup of temporary files
- User-friendly progress messages

**Examples:**
```
!play Blinding Lights The Weeknd
!play Shape of You Ed Sheeran
!play https://youtube.com/watch?v=dQw4w9WgXcQ
```

### !search <song name>

**Aliases:** `!ytsearch`, `!find`

**Features:**
- Shows top 3 YouTube search results
- Interactive selection (reply with 1, 2, or 3)
- 60-second session timeout
- Displays title, channel, duration, and views

**Examples:**
```
!search Adele Hello
!search Imagine Dragons Believer
```

## Architecture

### Session Management
- Uses `sessionManager` utility for temporary data storage
- Stores search results with 60-second auto-expiration
- Prevents memory leaks with automatic cleanup

### File Management
- Downloads to `tmp/` directory
- Automatic cleanup after sending
- Error handling for failed downloads

### Error Handling
- No results found
- Video too long (>10 minutes)
- Download failures
- Invalid selections
- Expired search sessions

## Integration Notes

The commands follow a modular structure designed to be loaded by the main bot logic:

```javascript
// Command structure
module.exports = {
  name: 'commandname',
  aliases: [],
  category: 'music',
  description: '...',
  usage: '!command <args>',
  examples: [],
  cooldown: 15,
  adminOnly: false,
  execute: async (from, args, helpers) => { ... }
};
```

### Expected Bot Integration

The bot should:
1. Scan the `commands/` directory recursively
2. Load all `.js` files as command modules
3. Register commands and their aliases
4. Handle cooldowns and permissions
5. Call `execute()` when command is triggered
6. For search command, also handle numeric replies (1-3) by calling `search.handleSelection()`

## Testing

Run the validation tests:
```bash
node test/test-commands.js
```

Tests verify:
- Command structure is valid
- Utilities load correctly
- Formatter functions work as expected

## Security

- No vulnerabilities found in dependencies (checked with gh-advisory-database)
- CodeQL security analysis passed with 0 alerts
- Proper input sanitization for filenames
- Safe file handling with cleanup

## Legal Compliance

Added legal disclaimer to README.md warning users about:
- YouTube Terms of Service
- Copyright laws
- Responsible use requirements

## Installation

After pulling these changes, run:
```bash
npm install
```

This will install the new dependencies (ytsr, ytdl-core).

## System Requirements

- **Node.js**: >= 20.x
- **ffmpeg**: Must be installed on the system for audio conversion
- **npm**: >= 10.x

## Future Enhancements

Potential improvements for future iterations:
- Quality selection (128kbps, 192kbps, 320kbps)
- Playlist support
- Download queue management
- User preferences (auto-quality, format)
- Cache frequently requested songs
- Thumbnail display in search results
