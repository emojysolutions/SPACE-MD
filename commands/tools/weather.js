const formatter = require('../../utils/formatter');

module.exports = {
    name: 'weather',
    aliases: ['temp', 'forecast'],
    category: 'tools',
    description: '🌤️ Get weather information (requires API key)',
    usage: '!weather <city>',
    cooldown: 5000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        if (args.length === 0) {
            return `🌤️ Please specify a city!\n\nUsage: ${formatter.mono('!weather London')}`;
        }

        const city = args.join(' ');

        // Placeholder response with instructions
        const message = `
🌤️ ${formatter.bold('WEATHER SERVICE')} 🌤️

${formatter.divider()}

⚠️ ${formatter.bold('API Key Required')}

To use this feature, you need to:

1️⃣ Get a free API key from OpenWeatherMap
   → https://openweathermap.org/api

2️⃣ Add it to your .env file:
   ${formatter.mono('OPENWEATHER_API_KEY=your_key_here')}

3️⃣ Restart the bot

${formatter.divider()}

📍 ${formatter.bold('Sample Weather Response for')} ${city}:

🌡️ Temperature: 22°C (72°F)
💧 Humidity: 65%
🌬️ Wind: 15 km/h NW
☁️ Conditions: Partly Cloudy
📊 Pressure: 1013 hPa

${formatter.divider()}

✨ ${formatter.italic('Configure your API key to get live weather data!')}
        `.trim();

        return message;
    }
};
