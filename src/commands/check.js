const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordApi = require('../PicartoAPI.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check')
        .setDescription("Enter a Picarto streamer to see if they are online.")
        .addStringOption(option => option.setName('username')
            .setDescription('The streamer\'s Picarto username to check.')
            .setRequired(true)
        ),
    async execute(interaction) {
        let input = interaction.options.getString('username');
        out = await DiscordApi.getApiReturn(input);

        console.log(out);

        // let isOnline = out['data']['online'] ? "ONLINE" : "OFFLINE";

        const outputEmbed = new EmbedBuilder()
            .setTitle("Kazerad") // Stuff is hardcoded atm for testing
            .setURL(`https://picarto.tv/kazerad`)
            .addFields(
                { name: "Kazerad: ", value: "Testing", inline: true }
            )
        await interaction.reply({
            embeds: [outputEmbed],
            ephemeral: true
        });
    },
};