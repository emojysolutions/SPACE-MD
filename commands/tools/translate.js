const formatter = require('../../utils/formatter');

const translations = {
    spanish: {
        hello: 'Hola',
        goodbye: 'Adiós',
        'thank you': 'Gracias',
        please: 'Por favor',
        yes: 'Sí',
        no: 'No',
        'good morning': 'Buenos días',
        'good night': 'Buenas noches',
        'how are you': '¿Cómo estás?',
        'i love you': 'Te amo'
    },
    french: {
        hello: 'Bonjour',
        goodbye: 'Au revoir',
        'thank you': 'Merci',
        please: 'S\'il vous plaît',
        yes: 'Oui',
        no: 'Non',
        'good morning': 'Bonjour',
        'good night': 'Bonne nuit',
        'how are you': 'Comment allez-vous?',
        'i love you': 'Je t\'aime'
    },
    japanese: {
        hello: 'こんにちは (Konnichiwa)',
        goodbye: 'さようなら (Sayonara)',
        'thank you': 'ありがとう (Arigatou)',
        please: 'お願いします (Onegaishimasu)',
        yes: 'はい (Hai)',
        no: 'いいえ (Iie)',
        'good morning': 'おはよう (Ohayou)',
        'good night': 'おやすみ (Oyasumi)',
        'how are you': '元気ですか (Genki desu ka)',
        'i love you': '愛してる (Aishiteru)'
    },
    arabic: {
        hello: 'مرحبا (Marhaba)',
        goodbye: 'مع السلامة (Ma\'a salama)',
        'thank you': 'شكرا (Shukran)',
        please: 'من فضلك (Min fadlik)',
        yes: 'نعم (Na\'am)',
        no: 'لا (La)',
        'good morning': 'صباح الخير (Sabah al-khayr)',
        'good night': 'تصبح على خير (Tusbih ala khayr)',
        'how are you': 'كيف حالك (Kayf halak)',
        'i love you': 'أحبك (Uhibbuk)'
    },
    hindi: {
        hello: 'नमस्ते (Namaste)',
        goodbye: 'अलविदा (Alvida)',
        'thank you': 'धन्यवाद (Dhanyavaad)',
        please: 'कृपया (Kripya)',
        yes: 'हाँ (Haan)',
        no: 'नहीं (Nahin)',
        'good morning': 'सुप्रभात (Suprabhat)',
        'good night': 'शुभ रात्रि (Shubh ratri)',
        'how are you': 'आप कैसे हैं (Aap kaise hain)',
        'i love you': 'मैं तुमसे प्यार करता हूँ (Main tumse pyar karta hoon)'
    }
};

module.exports = {
    name: 'translate',
    aliases: ['trans', 'tr'],
    category: 'tools',
    description: '🌐 Translate common phrases to different languages',
    usage: '!translate <language> <phrase>',
    cooldown: 3000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        if (args.length < 2) {
            const languages = Object.keys(translations).join(', ');
            return `🌐 Please specify a language and phrase!\n\nAvailable languages: ${languages}\n\nUsage: ${formatter.mono('!translate spanish hello')}`;
        }

        const language = args[0].toLowerCase();
        const phrase = args.slice(1).join(' ').toLowerCase();

        if (!translations[language]) {
            return `❌ Language not supported!\n\nAvailable: ${Object.keys(translations).join(', ')}`;
        }

        const translation = translations[language][phrase];

        if (!translation) {
            const availablePhrases = Object.keys(translations[language]).join(', ');
            return `❌ Phrase not found!\n\nAvailable phrases for ${language}:\n${availablePhrases}`;
        }

        const message = `
🌐 ${formatter.bold('TRANSLATION')} 🌐

${formatter.divider()}

🇬🇧 ${formatter.bold('English:')}
${phrase}

🌍 ${formatter.bold(language.charAt(0).toUpperCase() + language.slice(1) + ':')}
${translation}

${formatter.divider()}

✨ ${formatter.italic('Breaking language barriers!')}
        `.trim();

        return message;
    }
};
