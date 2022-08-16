const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require("./options");

const token = '5651529641:AAEK77iRmxlnra-JFPGGZZCD49Ga54yZoog'

const bot = new TelegramApi (token, {polling:true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9 и ты должен ее угадать!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай!', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command:'/start', description:'Начальное приветствие' },
        {command:'/info', description:'Получить информацию о пользователе' },
        {command:'/game', description:'игра угадай цифру' },
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text ==='/start'){
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp' )
            return  bot.sendMessage(chatId, `Добро пожаловать в телеграм бот BMW`)
        }
        if (text ==='/info'){
            return  bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game'){
           return startGame(chatId);
        }
        return bot.sendMessage(chatId,'Я тебя не понимаюб, попробуй еще раз!)')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again'){
            return startGame(chatId);

        }
        if (data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю!Ты отгадал цифру ${chats[chatId]}`,againOptions)
        } else {
            return await bot.sendMessage(chatId, `К сожелению ты не угадал цифру, бот загадал цифру ${chats[chatId]}`,againOptions)
        }
    })
}

start()