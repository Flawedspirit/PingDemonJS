const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        client.user.setActivity('your favourite streamers!', { type: ActivityType.Watching });
        client.logger.log(`${client.user.tag} is now ready!`, 'green');
    }
};