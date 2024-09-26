const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        client.user.setActivity('Picarto and Piczel', { type: ActivityType.Watching });
        client.logger.log(`${client.user.tag} is now ready!`, 'green');
    }
};