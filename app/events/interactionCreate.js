const { Events, Collection } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if(!interaction.isChatInputCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);

        if(!command){
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        // Handle command cooldowns here
        const { cooldowns } = interaction.client;

        if(!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }

        const now = Date.now();
        const lastCommand = cooldowns.get(command.data.name);
        const defaultCooldown = 3;
        const cooldownAmount = (command.cooldown ?? defaultCooldown) * 1000;

        if(lastCommand.has(interaction.user.id)) {
            const expiration = lastCommand.get(interaction.user.id) + cooldownAmount;

            if(now < expiration) {
                const expiredTimeStamp = Math.round((expiration - now) / 1000);
                return interaction.reply({ content: `Please wait another ${expiredTimeStamp} seconds to use this command again.`, ephemeral: true });
            }
        }

        lastCommand.set(interaction.user.id, now);
        setTimeout(() => lastCommand.delete(interaction.user.id), cooldownAmount);

        try {
            await command.execute(interaction);
        } catch(error) {
            interaction.client.logger.logError(`${error}\n${error.stack}`);

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: `There was an error while executing this command: ${error}`, ephemeral: true });
            } else {
                await interaction.reply({ content: `There was an error while executing this command: ${error}`, ephemeral: true });
            }
        }
    }
};