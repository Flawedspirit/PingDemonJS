const { PicartoAPI } = require('../PicartoAPI.js');
const App = require('../app.js');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute (interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (err) {
                App.handleError(interaction, err);
            }
        } else if (interaction.isButton()) {
            try {
                PicartoAPI.registerNotifier(interaction);
            } catch (err) {
                App.handleError(interaction, err);
            }
        }
    }
};
