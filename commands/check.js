const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const PicartoApi = require('../PicartoAPI.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check')
        .setDescription("Enter a Picarto streamer to see if they are live.")
        .addStringOption(option => option.setName('username')
            .setDescription("The streamer\'s Picarto username to check.")
            .setRequired(true)
        ),
    async execute(interaction) {
        let input = interaction.options.getString('username');

        PicartoApi.getApiReturn(input).then(function (out) {
            if (process.env.ENV === "development") interaction.client.logger.logDebug(JSON.stringify(out));

            let isOnline = out.online ? "ONLINE" : "OFFLINE";

            const outputEmbed = new EmbedBuilder()
                .setColor(0x35a775)
                .setTitle(out.name)
                .setDescription(out.title)
                .setURL(`https://picarto.tv/${out.name}`)
                .setThumbnail(out.avatar)
                .addFields(
                    { name: "Status", value: `${isOnline}`, inline: true },
                    { name: "Followers", value: `${out.followers}`, inline: true },
                    { name: "Watching", value: `${out.viewers}`, inline: true }
                )
            interaction.reply({
                embeds: [outputEmbed],
                ephemeral: true
            });
        })
    }
};
