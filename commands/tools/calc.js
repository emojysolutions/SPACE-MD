const formatter = require('../../utils/formatter');

// Safe mathematical expression evaluator
class Calculator {
    evaluate(expression) {
        // Remove all whitespace
        expression = expression.replace(/\s+/g, '');
        
        // Validate expression - only allow numbers, operators, and parentheses
        if (!/^[0-9+\-*/().^%√]+$/.test(expression)) {
            throw new Error('Invalid characters in expression');
        }

        // Replace √ with sqrt function
        expression = expression.replace(/√(\d+\.?\d*)/g, 'Math.sqrt($1)');
        
        // Replace ^ with **
        expression = expression.replace(/\^/g, '**');

        try {
            // Use Function constructor as a safer alternative to eval
            const result = new Function('Math', `'use strict'; return (${expression})`)(Math);
            
            if (!isFinite(result)) {
                throw new Error('Result is not a valid number');
            }
            
            return result;
        } catch (error) {
            throw new Error('Invalid mathematical expression');
        }
    }
}

module.exports = {
    name: 'calc',
    aliases: ['calculate', 'math'],
    category: 'tools',
    description: '🧮 Calculate mathematical expressions safely',
    usage: '!calc <expression>',
    cooldown: 2000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        if (args.length === 0) {
            return `🧮 Please provide a mathematical expression!\n\nSupported operators: +, -, *, /, ^, %, √\n\nExamples:\n• ${formatter.mono('!calc 2 + 2')}\n• ${formatter.mono('!calc 15 * 3')}\n• ${formatter.mono('!calc √16')}\n• ${formatter.mono('!calc 2^8')}`;
        }

        const expression = args.join(' ');
        const calculator = new Calculator();

        try {
            const result = calculator.evaluate(expression);
            
            const message = `
🧮 ${formatter.bold('CALCULATOR')} 🧮

${formatter.divider()}

📝 ${formatter.bold('Expression:')}
${formatter.mono(expression)}

📊 ${formatter.bold('Result:')}
${formatter.mono(result.toString())}

${formatter.divider()}

✨ ${formatter.italic('Math made easy!')}
            `.trim();

            return message;
        } catch (error) {
            return `❌ Error: ${error.message}\n\nPlease check your expression and try again.`;
        }
    }
};
