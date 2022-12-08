const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const PicartoApi = require('../PicartoAPI.js');
const App = require('../app.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check')
        .setDescription("Enter a Picarto streamer to see if they are live.")
        .addStringOption(option => option.setName('username')
            .setDescription("The streamer's Picarto username to check.")
            .setRequired(true)
        ),
    async execute (interaction) {
        const input = interaction.options.getString('username');


        PicartoApi.getApiReturn(input).then(function (out) {
            if (process.env.ENV === "development") interaction.client.logger.logDebug(JSON.stringify(out));

            if (out === "Channel does not exist") {
                // Send error message and return somehow
            }

            const isOnline = out.online ? "🔴 ONLINE" : "OFFLINE";

            const base = new EmbedBuilder()
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
                .setImage(out.thumbnails.web);
            const btnRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('register')
                    .setLabel("Notify Me!")
                    .setStyle(ButtonStyle.Success)
            );
            interaction.reply({
                embeds: [base],
                components: [btnRow],
                ephemeral: true
            });
        });
    }
};
