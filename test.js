#!/usr/bin/env node

/**
 * Simple test script to verify SPACE-MD Ultra bot structure
 * Tests command loading, formatting, and basic functionality
 */

const chalk = require('chalk');

console.log(chalk.cyan(`
╔══════════════════════════════════════════╗
║   🧪 SPACE-MD Ultra Test Suite 🧪       ║
╠══════════════════════════════════════════╣
║   Testing Bot Components                 ║
╚══════════════════════════════════════════╝
`));

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(chalk.green('✅'), name);
        testsPassed++;
    } catch (error) {
        console.log(chalk.red('❌'), name);
        console.log(chalk.red('   Error:'), error.message);
        testsFailed++;
    }
}

// Test 1: Config loading
test('Config module loads', () => {
    const config = require('./config');
    if (!config.BOT_NAME) throw new Error('BOT_NAME not defined');
    if (!config.BOT_PREFIX) throw new Error('BOT_PREFIX not defined');
});

// Test 2: Logger module
test('Logger module loads', () => {
    const logger = require('./utils/logger');
    if (typeof logger.info !== 'function') throw new Error('Logger.info not a function');
    if (typeof logger.error !== 'function') throw new Error('Logger.error not a function');
});

// Test 3: Formatter module
test('Formatter module loads and works', () => {
    const formatter = require('./utils/formatter');
    const boldText = formatter.bold('test');
    if (!boldText.includes('*')) throw new Error('Bold formatting failed');
    
    const divider = formatter.divider();
    if (divider.length === 0) throw new Error('Divider failed');
});

// Test 4: Session Manager
test('Session Manager works', () => {
    const sessionManager = require('./utils/sessionManager');
    
    sessionManager.setSession('test_user', { data: 'test' });
    const session = sessionManager.getSession('test_user');
    
    if (!session || session.data !== 'test') {
        throw new Error('Session set/get failed');
    }
    
    sessionManager.clearSession('test_user');
    const clearedSession = sessionManager.getSession('test_user');
    if (clearedSession !== null) {
        throw new Error('Session clear failed');
    }
});

// Test 5: Rate Limiter
test('Rate Limiter works', () => {
    const rateLimiter = require('./utils/rateLimiter');
    
    const result1 = rateLimiter.checkLimit('test_user_2');
    if (!result1.allowed) throw new Error('First request should be allowed');
    
    rateLimiter.reset('test_user_2');
});

// Test 6: Cooldown Manager
test('Cooldown Manager works', () => {
    const cooldown = require('./utils/cooldown');
    
    cooldown.setCooldown('test_user_3', 'test_command', 1000);
    
    if (!cooldown.isOnCooldown('test_user_3', 'test_command')) {
        throw new Error('Cooldown should be active');
    }
    
    cooldown.clearCooldown('test_user_3', 'test_command');
});

// Test 7: Command Loader
test('Command Loader loads commands', () => {
    const commandLoader = require('./commands/index');
    
    commandLoader.loadCommands();
    const commands = commandLoader.getCommands();
    
    if (commands.size === 0) {
        throw new Error('No commands loaded');
    }
    
    // Check for essential commands
    const essentialCommands = ['help', 'ping', 'about', 'menu'];
    for (const cmdName of essentialCommands) {
        const cmd = commandLoader.getCommand(cmdName);
        if (!cmd) {
            throw new Error(`Essential command '${cmdName}' not found`);
        }
        if (typeof cmd.execute !== 'function') {
            throw new Error(`Command '${cmdName}' has no execute function`);
        }
    }
    
    console.log(chalk.blue(`   → Loaded ${commands.size} commands`));
});

// Test 8: Data files
test('Data files are valid JSON', () => {
    const jokes = require('./data/jokes.json');
    const quotes = require('./data/quotes.json');
    const facts = require('./data/facts.json');
    const trivia = require('./data/trivia.json');
    const eightball = require('./data/8ball.json');
    
    if (!Array.isArray(jokes) || jokes.length === 0) {
        throw new Error('Jokes data invalid');
    }
    if (!Array.isArray(quotes) || quotes.length === 0) {
        throw new Error('Quotes data invalid');
    }
    if (!Array.isArray(facts) || facts.length === 0) {
        throw new Error('Facts data invalid');
    }
    if (!Array.isArray(trivia) || trivia.length === 0) {
        throw new Error('Trivia data invalid');
    }
    if (!Array.isArray(eightball) || eightball.length === 0) {
        throw new Error('8ball data invalid');
    }
    
    console.log(chalk.blue(`   → Jokes: ${jokes.length}, Quotes: ${quotes.length}, Facts: ${facts.length}, Trivia: ${trivia.length}`));
});

// Test 9: Middleware
test('Middleware modules load', () => {
    const auth = require('./middleware/auth');
    const antiSpam = require('./middleware/antiSpam');
    const errorHandler = require('./middleware/errorHandler');
    
    if (typeof auth.requireAdmin !== 'function') {
        throw new Error('auth.requireAdmin not a function');
    }
    if (typeof antiSpam.check !== 'function') {
        throw new Error('antiSpam.check not a function');
    }
    if (typeof errorHandler.handleCommandError !== 'function') {
        throw new Error('errorHandler.handleCommandError not a function');
    }
});

// Test 10: Command categories
test('Commands organized in categories', () => {
    const commandLoader = require('./commands/index');
    const categories = commandLoader.getCategories();
    
    const expectedCategories = ['general', 'fun', 'tools', 'games', 'admin'];
    
    for (const category of expectedCategories) {
        if (!categories.has(category)) {
            throw new Error(`Category '${category}' not found`);
        }
        const commands = categories.get(category);
        if (!Array.isArray(commands) || commands.length === 0) {
            throw new Error(`Category '${category}' has no commands`);
        }
    }
    
    console.log(chalk.blue(`   → Categories: ${Array.from(categories.keys()).join(', ')}`));
});

// Print summary
console.log(chalk.cyan('\n' + '═'.repeat(50)));
console.log(chalk.cyan('Test Summary:'));
console.log(chalk.green(`✅ Passed: ${testsPassed}`));
if (testsFailed > 0) {
    console.log(chalk.red(`❌ Failed: ${testsFailed}`));
}
console.log(chalk.cyan('═'.repeat(50) + '\n'));

if (testsFailed > 0) {
    console.log(chalk.red('Some tests failed! Please fix the issues above.'));
    process.exit(1);
} else {
    console.log(chalk.green('🎉 All tests passed! SPACE-MD Ultra is ready! 🚀'));
    process.exit(0);
}
