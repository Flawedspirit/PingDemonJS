const fs = require('node:fs');
const path = require('node:path');
const { PermissionsBitField, SlashCommandBuilder } = require('discord.js');

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads the bot\'s commands.'),
    async execute(interaction) {
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return interaction.reply({ content: "You must have `MANAGE SERVER` privileges in this guild to use this command.", ephemeral: true });
        }

        try {
            const commandDirPath = interaction.client.commandDirPath;
            const commandDirs = fs.readdirSync(commandDirPath);

            for(const dir of commandDirs) {
                const commandPath = path.join(commandDirPath, dir);
                const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

                for(const file of commandFiles) {
                     const filePath = path.join(commandPath, file);
                     const command = require(filePath);

                     delete require.cache[require.resolve(filePath)];
                     interaction.client.commands.set(command.data.name, command);

                     interaction.client.logger.log(`Reloaded command: ${filePath}`);
                }
            }
            await interaction.reply({ content: "Commands were successfully reloaded!", ephemeral: true });
        } catch(error) {
            interaction.client.logger.logError(`${error}\n${error.stack}`);
            await interaction.reply({ content: "There was an error reloading commands!", ephemeral: true });
        }
    }
};