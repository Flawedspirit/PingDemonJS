const { SlashCommandBuilder } = require('discord.js');
const Notifier = require('../../notifier.js');
const PicartoAPI = require('../../picartoAPI.js');
const PiczelAPI = require('../../piczelAPI.js');

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Enter a streamer to see if they\'re live.')
        .addStringOption(option => option.setName('service')
            .setDescription("The streaming service to check. Available options: Picarto, Piczel")
            .setRequired(true)
            .addChoices(
                { name: 'Picarto', value: 'picarto' },
                { name: 'Piczel', value: 'piczel' }
            ))
        .addStringOption(option => option.setName('username')
            .setDescription("The username or channel name to check.")
            .setRequired(true)),
    async execute(interaction) {
        let service = interaction.options.getString('service').toLowerCase();
        let user = interaction.options.getString('username');

        switch(service) {
            case 'picarto':
                await PicartoAPI.getAPIReturn(user).then((out) => {
                    interaction.reply({
                        embeds: [Notifier.picartoEmbed(out)],
                        ephemeral: true
                    });
                });
                break;
            case 'piczel':
                await PiczelAPI.getAPIReturn(user).then((out) => {
                    interaction.reply({
                        embeds: [Notifier.piczelEmbed(out)],
                        ephemeral: true
                    });
                });
                break;
            default:
                interaction.reply({
                    content: ':warning: Unknown or unsupported streaming site. Available options: Picarto, Piczel',
                    ephemeral: true
                });
            //end
        }
    }
};
