const { SlashCommandBuilder } = require('discord.js');
const responses = [
    'Hey!',
    'Pong!',
    'Polo!',
    'Aww... I wanted to say ping!',
    'I\'m up! I\'m up...',
    'Yes?',
    'You have my attention, outlander.',
    '...',
    'Not dignifying that with a response.',
    'Ping yourself!',
    'Reporting for duty!',
    'One ping only, Vasily.',
    'That tickles!',
    'At your service!',
    'O rly?',
    'Oooh! ( ͡° ͜ʖ ͡°)',
    'Да, Comrade?',
    'UwU',
    'You ever wonder why we\'re here?'
];

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping the bot to make sure it\'s listening.'),
    async execute(interaction) {
        let choice = ~~(Math.random() * responses.length);
        await interaction.reply({ content: responses[choice], ephemeral: true });
    }
};