const formatter = require('../../utils/formatter');

const todos = new Map();

module.exports = {
    name: 'todo',
    aliases: ['todolist', 'tasks'],
    category: 'tools',
    description: '✅ Manage your todo list',
    usage: '!todo <add/list/done/clear> [item]',
    cooldown: 3000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        if (args.length === 0) {
            return `✅ Todo List Manager\n\nCommands:\n• ${formatter.mono('!todo add <item>')} - Add a task\n• ${formatter.mono('!todo list')} - View all tasks\n• ${formatter.mono('!todo done <number>')} - Mark task as done\n• ${formatter.mono('!todo clear')} - Clear all tasks`;
        }

        const action = args[0].toLowerCase();
        const userTodos = todos.get(from) || [];

        switch (action) {
            case 'add':
                if (args.length < 2) {
                    return '❌ Please specify a task to add!\n\nExample: !todo add Buy groceries';
                }

                const task = args.slice(1).join(' ');
                userTodos.push({ task, done: false, id: userTodos.length + 1 });
                todos.set(from, userTodos);

                return `
✅ ${formatter.bold('TASK ADDED!')}

${formatter.divider()}

📝 ${task}

${formatter.bold('Total tasks:')} ${userTodos.length}

${formatter.divider()}

💡 Use ${formatter.mono('!todo list')} to view all tasks
                `.trim();

            case 'list':
                if (userTodos.length === 0) {
                    return `📋 Your todo list is empty!\n\nAdd a task with ${formatter.mono('!todo add <task>')}`;
                }

                let listMessage = `
📋 ${formatter.bold('YOUR TODO LIST')}

${formatter.divider()}

`;
                userTodos.forEach((item, index) => {
                    const checkbox = item.done ? '✅' : '☐';
                    const strikethrough = item.done ? '~' : '';
                    listMessage += `${checkbox} ${index + 1}. ${strikethrough}${item.task}${strikethrough}\n`;
                });

                const completedCount = userTodos.filter(t => t.done).length;

                listMessage += `
${formatter.divider()}

📊 ${formatter.bold('Progress:')} ${completedCount}/${userTodos.length} completed
                `.trim();

                return listMessage;

            case 'done':
                if (args.length < 2) {
                    return '❌ Please specify the task number!\n\nExample: !todo done 1';
                }

                const taskNum = parseInt(args[1]);
                if (isNaN(taskNum) || taskNum < 1 || taskNum > userTodos.length) {
                    return `❌ Invalid task number! You have ${userTodos.length} tasks.`;
                }

                userTodos[taskNum - 1].done = true;
                todos.set(from, userTodos);

                return `
✅ ${formatter.bold('TASK COMPLETED!')}

${formatter.divider()}

${formatter.strike(userTodos[taskNum - 1].task)}

${formatter.divider()}

🎉 ${formatter.italic('Great job! Keep going!')}
                `.trim();

            case 'clear':
                todos.delete(from);
                return `
🗑️ ${formatter.bold('TODO LIST CLEARED!')}

${formatter.divider()}

All tasks have been removed.

💡 Start fresh with ${formatter.mono('!todo add <task>')}
                `.trim();

            default:
                return `❌ Unknown action: ${action}\n\nAvailable: add, list, done, clear`;
        }
    }
};
