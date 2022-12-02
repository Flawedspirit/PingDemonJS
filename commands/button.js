module.exports = {
    cooldown: 1,
    async execute(interaction) {
        let choice = ~~(Math.random() * responses.length);
        await interaction.reply({ content: responses[choice], ephemeral: true });
    },
};