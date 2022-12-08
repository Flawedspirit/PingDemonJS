const { ComponentBuilder } = require("discord.js");

module.exports = {
    data: new ComponentBuilder()
        .setName('register'),
    async execute (interaction) {
        await interaction.reply({
            content: "This is where you'd be granted a role."
        });
    }
};