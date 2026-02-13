# 📚 SPACE-MD Ultra - Command Reference

Quick reference guide for all available commands.

## 🎯 Command Format

All commands start with the prefix (default: `!`)

```
!command [required_argument] <optional_argument>
```

## 📋 General Commands

| Command | Description | Usage | Example |
|---------|-------------|-------|---------|
| `!menu` | Beautiful categorized menu | `!menu` | `!menu` |
| `!help` | Get help about commands | `!help [command]` | `!help joke` |
| `!ping` | Check bot latency & uptime | `!ping` | `!ping` |
| `!about` | Bot information & stats | `!about` | `!about` |

## 🎉 Fun Commands

| Command | Description | Usage | Example |
|---------|-------------|-------|---------|
| `!joke` | Random joke (30+ jokes) | `!joke` | `!joke` |
| `!quote` | Inspirational quote (50+ quotes) | `!quote` | `!quote` |
| `!8ball` | Magic 8-ball fortune | `!8ball <question>` | `!8ball Will I succeed?` |
| `!flip` | Flip a coin | `!flip` | `!flip` |
| `!roll` | Roll dice (D&D notation) | `!roll [XdY]` | `!roll 3d6` |
| `!fact` | Random fun fact (40+ facts) | `!fact` | `!fact` |
| `!horoscope` | Daily horoscope by zodiac sign | `!horoscope <sign>` | `!horoscope aries` |

### Horoscope Signs
aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces

## 🛠️ Tool Commands

| Command | Description | Usage | Example |
|---------|-------------|-------|---------|
| `!calc` | Safe math calculator | `!calc <expression>` | `!calc 2 + 2 * 5` |
| `!weather` | Weather info (needs API key) | `!weather <city>` | `!weather London` |
| `!translate` | Basic phrase translation | `!translate <lang> <phrase>` | `!translate spanish hello` |
| `!time` | World clock for cities | `!time <city>` | `!time Tokyo` |
| `!remind` | Set a reminder (in-memory) | `!remind <minutes> <message>` | `!remind 5 Take a break` |
| `!todo` | Manage todo list | `!todo <action> [item]` | `!todo add Buy groceries` |
| `!shorten` | URL shortener (needs API) | `!shorten <url>` | `!shorten https://example.com` |

### Calculator Operators
- `+` Addition
- `-` Subtraction
- `*` Multiplication
- `/` Division
- `^` Power
- `%` Modulo
- `√` Square root

### Supported Languages
spanish, french, japanese, arabic, hindi

### Available Cities (World Clock)
london, paris, tokyo, sydney, new york, los angeles, chicago, dubai, moscow, beijing, mumbai, singapore, hong kong, toronto, berlin

### Todo Actions
- `add <item>` - Add new task
- `list` - View all tasks
- `done <number>` - Mark task as complete
- `clear` - Clear all tasks

## 🎮 Game Commands

| Command | Description | Usage | Example |
|---------|-------------|-------|---------|
| `!trivia` | Trivia quiz with scoring | `!trivia [answer]` | `!trivia` then `!trivia A` |
| `!wordgame` | Word scramble game | `!wordgame [answer]` | `!wordgame` then `!wordgame elephant` |
| `!rps` | Rock Paper Scissors | `!rps <choice>` | `!rps rock` |
| `!numguess` | Number guessing (1-100) | `!numguess [number]` | `!numguess` then `!numguess 50` |
| `!hangman` | Text-based hangman | `!hangman [letter]` | `!hangman` then `!hangman a` |

### Game Instructions

#### Trivia
1. Type `!trivia` to get a question
2. Answer with `!trivia A` (or B, C, D)
3. Score is tracked per user

#### Word Game
1. Type `!wordgame` to get a scrambled word
2. Unscramble it and reply with `!wordgame <answer>`
3. Get hints about difficulty and category

#### Rock Paper Scissors
- Type `!rps rock`, `!rps paper`, or `!rps scissors`
- Bot makes a choice and determines winner

#### Number Guessing
1. Type `!numguess` to start
2. Bot picks a number 1-100
3. Guess with `!numguess <number>`
4. Get hot/cold hints

#### Hangman
1. Type `!hangman` to start
2. Guess letters with `!hangman <letter>`
3. Try to complete the word before running out of guesses

## 👑 Admin Commands

| Command | Description | Usage | Example |
|---------|-------------|-------|---------|
| `!stats` | Bot statistics & analytics | `!stats <password>` | `!stats mypassword123` |
| `!broadcast` | Send message to all users | `!broadcast <password> <msg>` | `!broadcast mypassword123 Hello everyone!` |
| `!settings` | View/modify bot settings | `!settings <password> [action]` | `!settings mypassword123 view` |

⚠️ **Note**: Admin commands require the admin password set in your `.env` file.

## 💡 Tips & Tricks

### Rate Limiting
- Default: 10 messages per 30 seconds
- If exceeded, wait for the cooldown period

### Command Cooldowns
- Each command has a cooldown (typically 3 seconds)
- Prevents spam and abuse
- Different commands have different cooldowns

### Session Timeout
- Game sessions expire after 10 minutes of inactivity
- Start a new game if session expired

### Aliases
Many commands have aliases (shortcuts):

- `!help` = `!h`
- `!ping` = `!latency` or `!speed`
- `!8ball` = `!eightball` or `!ask`
- `!flip` = `!coin` or `!coinflip`
- `!roll` = `!dice` or `!rolldice`
- `!calc` = `!calculate` or `!math`
- `!translate` = `!trans` or `!tr`
- `!time` = `!clock` or `!timezone`
- `!rps` = `!rockpaperscissors`
- `!todo` = `!todolist` or `!tasks`

## 🎨 Message Formatting

Commands return beautifully formatted messages with:

- ✨ **Headers** - Bold titles with emojis
- 📊 **Sections** - Organized with dividers
- 💬 **Code blocks** - For commands and examples
- 🎯 **Emojis** - Visual indicators and icons
- _Italics_ - For tips and notes

## 🚀 Advanced Features

### Multi-step Games
Some commands like trivia and hangman maintain state:

1. Start the game with the command
2. Bot remembers your progress
3. Continue playing with follow-up commands
4. Session auto-expires after 10 minutes

### Reminders
Set reminders that trigger after a delay:

```
!remind 30 Meeting in 30 minutes
```

Bot will message you back after 30 minutes.

### Todo Lists
Manage personal todo lists:

```
!todo add Finish homework
!todo add Call mom
!todo list
!todo done 1
```

## 📊 Statistics Tracked

The bot tracks (viewable with `!stats` admin command):

- Total messages processed
- Unique users
- Command usage frequency
- Uptime
- Memory usage
- Active sessions

## 🔧 Customization

Want to change the command prefix?

Edit `.env` file:
```env
BOT_PREFIX=$
```

Now commands use `$` instead of `!`:
- `$help`
- `$joke`
- `$trivia`

## ❓ Common Questions

**Q: Why isn't the bot responding?**
A: Check if you're using the correct prefix (default: `!`)

**Q: Command says "on cooldown"?**
A: Wait a few seconds between commands

**Q: Game session lost?**
A: Sessions expire after 10 minutes of inactivity

**Q: Rate limit exceeded?**
A: Wait 30 seconds before sending more commands

**Q: How to become admin?**
A: Admin commands need the password from `.env`

## 🆘 Need Help?

1. Try `!help` for general help
2. Try `!help <command>` for specific command info
3. Check the main README.md
4. Check SETUP.md for configuration
5. Report issues on GitHub

---

**🎮 Have fun exploring SPACE-MD Ultra!** 🚀
