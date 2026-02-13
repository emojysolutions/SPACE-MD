const formatter = require('../../utils/formatter');

const words = [
    'javascript', 'python', 'rocket', 'galaxy', 'planet', 'star',
    'computer', 'rainbow', 'elephant', 'mountain', 'ocean', 'forest',
    'thunder', 'lightning', 'crystal', 'diamond', 'treasure', 'adventure',
    'mystery', 'puzzle', 'champion', 'victory', 'harmony', 'melody'
];

const hangmanStages = [
    `
    ┌─────┐
    │     │
    │     
    │    
    │    
    │   
    └─────
    `,
    `
    ┌─────┐
    │     │
    │     O
    │    
    │    
    │   
    └─────
    `,
    `
    ┌─────┐
    │     │
    │     O
    │     |
    │    
    │   
    └─────
    `,
    `
    ┌─────┐
    │     │
    │     O
    │    /|
    │    
    │   
    └─────
    `,
    `
    ┌─────┐
    │     │
    │     O
    │    /|\\
    │    
    │   
    └─────
    `,
    `
    ┌─────┐
    │     │
    │     O
    │    /|\\
    │    / 
    │   
    └─────
    `,
    `
    ┌─────┐
    │     │
    │     O
    │    /|\\
    │    / \\
    │   
    └─────
    GAME OVER!
    `
];

module.exports = {
    name: 'hangman',
    aliases: ['hang'],
    category: 'games',
    description: '🎯 Play hangman word guessing game',
    usage: '!hangman [letter]',
    cooldown: 2000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        let session = sessionManager.getSession(from);

        // If user is guessing a letter
        if (session && session.game === 'hangman' && args.length > 0) {
            const guess = args[0].toLowerCase();

            if (guess.length !== 1 || !/[a-z]/.test(guess)) {
                return '❌ Please guess a single letter (a-z)!';
            }

            if (session.guessedLetters.includes(guess)) {
                return `❌ You already guessed "${guess}"!\n\nGuessed letters: ${session.guessedLetters.join(', ')}`;
            }

            session.guessedLetters.push(guess);

            // Check if letter is in the word
            if (session.word.includes(guess)) {
                // Correct guess - update display
                let newDisplay = '';
                for (let i = 0; i < session.word.length; i++) {
                    if (session.guessedLetters.includes(session.word[i])) {
                        newDisplay += session.word[i];
                    } else {
                        newDisplay += '_';
                    }
                }
                session.displayWord = newDisplay;

                // Check if won
                if (!newDisplay.includes('_')) {
                    sessionManager.clearSession(from);
                    
                    return `
🎉 ${formatter.bold('YOU WIN!')} 🎉

${formatter.divider()}

✅ The word was: ${formatter.bold(session.word.toUpperCase())}
🎯 ${formatter.bold('Attempts:')} ${session.wrongGuesses}/${hangmanStages.length - 1} wrong guesses
📝 ${formatter.bold('Guessed:')} ${session.guessedLetters.join(', ')}

${formatter.divider()}

🏆 ${formatter.italic('Excellent word-guessing skills!')}
Play again: ${formatter.mono('!hangman')}
                    `.trim();
                }

                sessionManager.setSession(from, session);

                return `
✅ ${formatter.bold('GOOD GUESS!')}

${formatter.divider()}

${formatter.mono(hangmanStages[session.wrongGuesses])}

Word: ${formatter.mono(session.displayWord.split('').join(' ').toUpperCase())}

✅ Correct letters: ${session.guessedLetters.filter(l => session.word.includes(l)).join(', ')}
❌ Wrong guesses: ${session.wrongGuesses}/${hangmanStages.length - 1}

${formatter.divider()}

💬 Guess a letter: ${formatter.mono('!hangman <letter>')}
                `.trim();
            } else {
                // Wrong guess
                session.wrongGuesses++;

                if (session.wrongGuesses >= hangmanStages.length - 1) {
                    sessionManager.clearSession(from);
                    
                    return `
💀 ${formatter.bold('GAME OVER!')} 💀

${formatter.divider()}

${formatter.mono(hangmanStages[hangmanStages.length - 1])}

The word was: ${formatter.bold(session.word.toUpperCase())}
📝 ${formatter.bold('Your guesses:')} ${session.guessedLetters.join(', ')}

${formatter.divider()}

💪 ${formatter.italic('Better luck next time!')}
Try again: ${formatter.mono('!hangman')}
                    `.trim();
                }

                sessionManager.setSession(from, session);

                return `
❌ ${formatter.bold('WRONG LETTER!')}

${formatter.divider()}

${formatter.mono(hangmanStages[session.wrongGuesses])}

Word: ${formatter.mono(session.displayWord.split('').join(' ').toUpperCase())}

✅ Correct letters: ${session.guessedLetters.filter(l => session.word.includes(l)).join(', ') || 'none'}
❌ Wrong letters: ${session.guessedLetters.filter(l => !session.word.includes(l)).join(', ')}
💀 Wrong guesses: ${session.wrongGuesses}/${hangmanStages.length - 1}

${formatter.divider()}

💬 Guess a letter: ${formatter.mono('!hangman <letter>')}
                `.trim();
            }
        }

        // Start new game
        const word = words[Math.floor(Math.random() * words.length)];
        const displayWord = '_'.repeat(word.length);

        sessionManager.setSession(from, {
            game: 'hangman',
            word: word,
            displayWord: displayWord,
            guessedLetters: [],
            wrongGuesses: 0
        });

        const message = `
🎯 ${formatter.bold('HANGMAN GAME!')} 🎯

${formatter.divider()}

${formatter.mono(hangmanStages[0])}

Word: ${formatter.mono(displayWord.split('').join(' '))}
📏 ${formatter.bold('Length:')} ${word.length} letters

💀 ${formatter.bold('Wrong guesses allowed:')} ${hangmanStages.length - 1}

${formatter.divider()}

💬 ${formatter.bold('How to play:')}
Guess one letter at a time
${formatter.mono('!hangman <letter>')}

Example: ${formatter.mono('!hangman a')}

${formatter.divider()}

🎮 ${formatter.italic('Good luck!')}
        `.trim();

        return message;
    }
};
