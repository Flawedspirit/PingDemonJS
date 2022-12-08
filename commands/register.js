const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription("Enter a Picarto streamer to monitor the status of.")
        .addStringOption(option => option.setName('username')
            .setDescription('The streamer\'s Picarto username to watch.')
            .setRequired(true)
        ),
    async execute (interaction) {

        // Actual fun stuff here

        await interaction.reply({
            content: `This command is not implemented yet. Sorry! For the record though, you typed in "${interaction.options.getString('username')}."`,
            ephemeral: true
        });
    },
};