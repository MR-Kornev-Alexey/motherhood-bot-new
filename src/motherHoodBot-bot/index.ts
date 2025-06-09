import { Context, Telegraf } from "telegraf";
import { config } from "../config/config.js";
import consultationsService from "../services/common-db.js";
import { handlePolicyAgreement } from "../component/handlePolicyAgreement.js";
import { sendKeyboard } from "../component/sendKeyboard.js";

// @ts-ignore
import { Message } from 'telegraf/typings/core/types/typegram';

// ======= Инициализация ===========
const token = process.env.NODE_ENV === 'production'
    ? config.MOTHER_BOT_TOKEN
    : config.DEV_MOTHER_BOT_TOKEN;

if (!token) throw new Error('AnswererBot token is not defined!');
const motherHoodBot = new Telegraf(token);

const webTerms = config.URL_TERMS;
const webPrivacy = config.URL_PRIVACY;
const start = `Приветствую Вас в Чатботе канала Елены Корневой`;

// ======= Очередь отложенных сообщений ===========
const pendingMessages: Map<number, string[]> = new Map();

motherHoodBot.start(async (ctx) => {
    try {
        await ctx.replyWithHTML(
            `<b>Добрый день ${ctx.message.from.first_name || 'незнакомец'}!</b>\n${start}`
        );

        await ctx.reply("Задайте вопрос в сообщении", {
            reply_markup: {
                keyboard: [
                    [
                        { text: "Пользовательское соглашение" },
                        { text: "Политика конфиденциальности" }
                    ]
                ],
                resize_keyboard: true,
                one_time_keyboard: false
            }
        });

        // Создаем или обновляем запись в БД
        await consultationsService.start({
            chat_id: ctx.message.from.id,
            first_name: ctx.message.from.first_name || "default",
            last_name: ctx.message.from.last_name || "default",
            username: ctx.message.from.username || "default",
        });

        // Отправляем отложенные сообщения (если есть)
        const pending = pendingMessages.get(ctx.message.from.id);
        if (pending?.length) {
            for (const msg of pending) {
                await ctx.reply(msg);
            }
            pendingMessages.delete(ctx.message.from.id);
        }

    } catch (e) {
        console.error("Error in /start command:", e);
    }
});

motherHoodBot.hears('Пользовательское соглашение', async (ctx) => {
    await handlePolicyAgreement(ctx, "Вы будете переадресованы на сайт...", webTerms);
});

// ======= Безопасная отправка сообщений ===========
async function safeSendMessage(ctx: Context, userId: number, text: string) {
    try {
        await ctx.telegram.sendMessage(userId, text);
        return true;
    } catch (error: any) {
        if (error.response?.error_code === 403) {
            return false; // Бот не активирован
        }
        console.error(`❌ Ошибка отправки сообщения пользователю ${userId}: ${error.message}`);
        return false;
    }
}
motherHoodBot.command('support', async (ctx) => {
    const supportText = `
📞 Тех.поддержка Елены:
Если у вас возникли вопросы или проблемы, пожалуйста, свяжитесь с нами
💬 Telegram: @MrkDigital  
  `;

    await ctx.reply(supportText, {
        link_preview_options: { is_disabled: true } // Новый корректный параметр
    });
});
motherHoodBot.command('help', async (ctx) => {
    const supportText = `
📞 Служба помощи Елены:
Если у вас возникли вопросы или проблемы, пожалуйста, свяжитесь с нами
💬 Telegram: @MrkDigital  
  `;

    await ctx.reply(supportText, {
        link_preview_options: { is_disabled: true } // Новый корректный параметр
    });
});
// ======= Обработчик сообщений ===========
motherHoodBot.on('message', async (ctx) => {
    const msg = ctx.message as Message.CommonMessage;

    if (!msg.from) return;

    const userId = msg.from.id;
    const userName = msg.from.first_name || "незнакомец";
    console.log('✉️ Новое сообщение от пользователя:', userId);

    if (msg.chat.type === 'supergroup' && msg.reply_to_message?.forward_from_chat) {
        const textForUser = (msg.text === 'Разбор' || msg.text === 'разбор')
            ? `📢 Важное объявление\n✅ В связи с большим количеством заявок, бесплатные разборы Елены Корневой приостановлены.\n🔹 Доступны платные услуги\nЕсли вам нужна индивидуальная помощь, могу отправить офер\n👉 Хотите подробности? Напишите мне в личку @MrkDigital, и я пришлю:\n✅ Список услуг\n✅ Сроки выполнения\n✅ Стоимость\n💬 Отвечу оперативно!\nС уважением, Алексей, техлид и партнер Елены\n@MrkDigital`
            : `Ваше сообщение передано Елене. 🌸\n📢 Важное объявление\n✅ В связи с большим количеством заявок, бесплатные разборы Елены Корневой приостановлены.\n🔹 Доступны платные услуги\nЕсли вам нужна индивидуальная помощь, могу отправить офер\n👉 Хотите подробности? Напишите мне в личку @MrkDigital, и я пришлю:\n✅ Список услуг\n✅ Сроки выполнения\n✅ Стоимость\n💬 Отвечу оперативно!\nС уважением, Алексей, техлид и партнер Елены\n@MrkDigital`;

        const sent = await safeSendMessage(ctx, userId, textForUser);

        try {
            if (sent) {
                // Ответ в супергруппе
                await ctx.reply(`📬 ${userName}, мы написали вам в личные сообщения.`, {
                    // @ts-ignore
                    reply_to_message_id: msg.message_id // Используем message_id напрямую
                });
            } else {
                // Пользователь не активировал бота
                const botUsername = (await ctx.telegram.getMe()).username;
                const botLink = `https://t.me/${botUsername}?start`;


                await ctx.reply(
                    `${userName}, чтобы мы могли связаться с вами — пожалуйста, откройте бот.`,
                    {
                        reply_markup: {
                            inline_keyboard: [[
                                { text: "🔓 Открыть бот", url: botLink }
                            ]]
                        },
                        // @ts-ignore
                        reply_to_message_id: msg.message_id // Используем message_id напрямую
                    }
                );

                // Сохраняем сообщение в очередь
                const previous = pendingMessages.get(userId) || [];
                pendingMessages.set(userId, [...previous, textForUser]);
            }
        } catch (error) {
            console.error('Ошибка при ответе в группе:', error);
        }
    } else {
        // Прямое сообщение в личку
        await safeSendMessage(ctx, userId, 'Спасибо за ваше обращение!\nМы скоро свяжемся с вами');
    }
});


export { motherHoodBot };
