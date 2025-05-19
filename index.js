const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const dotenv = require('dotenv');
dotenv.config();

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN
const REMEMBER_WEB_COOKIE = process.env.REMEMBER_WEB_COOKIE

const bot = new Telegraf(TG_BOT_TOKEN);

const monitoringTasks = {};

// Helper function for escaping MarkdownV2
function escapeMarkdown(text) {
    return text.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
}

// /rotation <number> command
bot.command('rotation', (ctx) => {
    const chatId = ctx.chat.id;
    const message = ctx.message.text;
    const parts = message.split(' ');

    if (parts.length < 2) {
        ctx.reply('Пожалуйста, укажите номер ротации: /rotation <число>');
        return;
    }

    const rotationNumber = parts[1];

    if (monitoringTasks[chatId]) {
        clearInterval(monitoringTasks[chatId]);
        delete monitoringTasks[chatId];
    }

    ctx.reply(`Start monitoring for rotation ${rotationNumber}...`);

    monitoringTasks[chatId] = setInterval(async () => {
        try {
            const res = await fetch('https://podval-arma.ru/profile', {
                headers: {
                    'Cookie': REMEMBER_WEB_COOKIE
                }
            });
            const html = await res.text();
            const $ = cheerio.load(html);

            $('.ui-announces-item').each((_, el) => {
                const rotationText = $(el).find('.ui-announces-item-author .ui-bandage.red').text().trim();
                if (rotationText === `Для ротации ${rotationNumber}`) {
                    const passwordText = $(el).find('.ui-announces-item-message p').text().trim();
                    const password = passwordText.split(':')[1]

                    ctx.reply(`Pass: \`${
                        escapeMarkdown(password)
                    }\``, {
                        parse_mode: 'MarkdownV2'
                    });
                    clearInterval(monitoringTasks[chatId]);
                    delete monitoringTasks[chatId];
                    return false; // выйти из each
                }
            });
        } catch (err) {
            console.error('Error:', err.message);
        }
    }, 300);
});

// /help command
bot.command('help', (ctx) => {
    ctx.reply(`📌 Available commands:
/rotation <number> — start monitoring the specified rotation.
/stop — stop monitoring.
/help — show this help message.`);
});

// /ping command
bot.command('ping', (ctx) => {
    ctx.reply(`pong`);
});

// /stop command
bot.command('stop', (ctx) => {
    const chatId = ctx.chat.id;
    if (monitoringTasks[chatId]) {
        clearInterval(monitoringTasks[chatId]);
        delete monitoringTasks[chatId];
        ctx.reply('🛑 Monitoring stopped.');
    } else {
        ctx.reply('❗ Monitoring was not active.');
    }
});

bot.launch();
console.log('Bot is running');
