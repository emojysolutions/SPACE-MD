const formatter = require('../../utils/formatter');

const horoscopes = {
    aries: "Today is your day to shine! Take bold steps and embrace new opportunities. The stars align in your favor for creative projects.",
    taurus: "Focus on stability today. Your practical nature will guide you to make wise decisions. A financial opportunity may present itself.",
    gemini: "Communication is key today. Share your ideas with others and you'll find unexpected support. Your curiosity leads to discovery.",
    cancer: "Trust your intuition today. Your emotional intelligence helps you navigate complex situations. Home and family bring comfort.",
    leo: "Your natural charisma is magnetic today. Step into the spotlight and share your talents. Recognition is coming your way.",
    virgo: "Attention to detail serves you well today. Organize your thoughts and tasks for maximum efficiency. Health matters require focus.",
    libra: "Balance is your theme today. Seek harmony in relationships and decisions. Your diplomatic skills smooth over conflicts.",
    scorpio: "Your intensity and passion drive success today. Trust your instincts in matters of the heart. Transformation is on the horizon.",
    sagittarius: "Adventure calls! Your optimistic spirit attracts positive experiences. Learning something new brings joy and growth.",
    capricorn: "Your hard work is paying off. Stay focused on long-term goals. Professional recognition and success are within reach.",
    aquarius: "Innovation and creativity flow freely today. Your unique perspective offers solutions others miss. Connect with like-minded people.",
    pisces: "Your compassion and empathy are superpowers today. Artistic pursuits bring fulfillment. Trust in the universe's plan for you."
};

module.exports = {
    name: 'horoscope',
    aliases: ['zodiac', 'astrology'],
    category: 'fun',
    description: '⭐ Get your daily horoscope by zodiac sign',
    usage: '!horoscope <sign>',
    cooldown: 5000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        if (args.length === 0) {
            const signs = Object.keys(horoscopes).join(', ');
            return `⭐ Please specify your zodiac sign!\n\nAvailable signs:\n${signs}\n\nUsage: ${formatter.mono('!horoscope aries')}`;
        }

        const sign = args[0].toLowerCase();
        const horoscope = horoscopes[sign];

        if (!horoscope) {
            return `❌ Unknown zodiac sign: ${sign}\n\nPlease use one of: ${Object.keys(horoscopes).join(', ')}`;
        }

        const signEmoji = {
            aries: '♈',
            taurus: '♉',
            gemini: '♊',
            cancer: '♋',
            leo: '♌',
            virgo: '♍',
            libra: '♎',
            scorpio: '♏',
            sagittarius: '♐',
            capricorn: '♑',
            aquarius: '♒',
            pisces: '♓'
        };

        const emoji = signEmoji[sign] || '⭐';

        const message = `
${emoji} ${formatter.bold(sign.toUpperCase() + ' HOROSCOPE')} ${emoji}

${formatter.divider()}

📅 ${formatter.bold('Today\'s Reading:')}

${horoscope}

${formatter.divider()}

✨ ${formatter.italic('The stars have spoken!')} 🌟
        `.trim();

        return message;
    }
};
