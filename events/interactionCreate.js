const PicartoAPI = require('../PicartoAPI.js');
const App = require('../app.js');

module.exports = {
    name: 'interactionCreate',
    once: true,
    async execute(interaction) {
        if (!interaction.isCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;

        if (interaction.isButton) {
            console.log(interaction);
        }

        try {
            await command.execute(interaction);
        } catch (err) {
            if (err) interaction.client.logger.logError(err.stack);
            await interaction.reply({ content: "Ow! Something went wrong executing that command! Please let an admin know this happened.", ephemeral: true });
        }
    }
}