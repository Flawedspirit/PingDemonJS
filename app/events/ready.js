const { Events, ActivityType } = require('discord.js');
const { watching_message } = require('../../config.json');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        if(watching_message) {
            client.user.setActivity(`${watching_message}`, { type: ActivityType.Watching });
        } else {
            client.user.setActivity("your favourite streamers!", { type: ActivityType.Watching });
        }

        client.logger.log(`${client.user.tag} is now ready!`, 'green');
    }
};