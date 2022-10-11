const { SlashCommandBuilder } = require('@discordjs/builders');
const responses = [
    "Hey!",
    "Pong!",
    "Polo!",
    "Aww, I wanted to say ping!",
    "I\'m up! I\'m up...",
    "Yes?",
    "You have my attention, outlander.",
    "...",
    "Not dignifying that with a response.",
    "Ping yourself!",
    "Reporting for duty!",
    "One ping only, Vasily.",
    "That tickles!",
    "At your service!",
    "O rly?",
    "Oooh! ( ͡° ͜ʖ ͡°)",
    "Да, Comrade?",
    "uwu",
    "You ever wonder why we're here?"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Pings the bot to make sure it's paying attention."),
    async execute(interaction) {
        let choice = ~~(Math.random() * responses.length);
        await interaction.reply({ content: responses[choice], ephemeral: true });
    },
};
