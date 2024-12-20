// Halt and catch fire if minimum node version is not met
if(parseFloat(process.versions.node) < 18.17) throw new Error('Incompatible Node.js version. Please use version 18.17 or higher.');

const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { debug, logTimestamps, notify, notifyChannel, pingRate, token } = require('../config.json');

const Logger = require('./logger.js');
const Notifier = require('./notifier.js');
const PicartoAPI = require('./picartoAPI.js');
const PiczelAPI = require('./piczelAPI.js');
const TwitchAPI = require('./twitchAPI.js');

// Create new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Store commands property so they can be accessed elsewhere
client.commands = new Collection();
client.cooldowns = new Collection();

client.logger = new Logger(logTimestamps);

// Command handling here
client.commandDirPath = path.join(__dirname, 'commands');
const commandDirs = fs.readdirSync(client.commandDirPath);

if(debug) {
    client.logger.logDebug(`Command directory: ${client.commandDirPath}`);
    client.logger.logDebug(`Command types: ${commandDirs}`);
}

for(const dir of commandDirs) {
    const commandPath = path.join(client.commandDirPath, dir);
    const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

    for(const file of commandFiles) {
        const filePath = path.join(commandPath, file);
        const command = require(filePath);
        client.logger.log(`Registered command: ${filePath}`);

        // Create a new item in the Collection with the command as the key and the exported module as the value
        if('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command)
        } else {
            client.logger.logWarn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Event handling here
const eventPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith('.js'));

for(const file of eventFiles) {
    const filePath = path.join(eventPath, file);
    const event = require(filePath);

    // Create a new item in the Collection with the command as the key and the exported module as the value
    if(event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

async function pingAPI() {
    // Clamp pingRate to at least 5 sec to avoid running into API limits.
    let rate = Math.max(pingRate, 5) * 1000;

    let currentState = new Collection();
    let notifiedOf = [];

    setInterval(async () => {
        // Bot will now do stuff every X seconds determined by rate.
        try {
            // PICARTO
            if(notify.picarto) {
                for(let user in notify.picarto) {
                    await PicartoAPI.getAPIReturn(notify.picarto[user][0]).then((status) => {
                        currentState.set(status.name, {'name': status.name, 'isOnline': status.online});

                        if(!notifiedOf.includes(status.name) && status.online === true) {
                            // Notify everyone here
                            client.channels.fetch(notifyChannel).then(channel => {
                                // Ping users with the supplied role IDs of each streamer
                                try {
                                    client.logger.log(`${status.name} is now online.`);
                                    channel.send({ content: `<@&${notify.picarto[user][1]}>`, embeds: [Notifier.picartoEmbed(status)] });
                                } catch(error) {
                                    client.logger.logError(error);
                                }
                            }).catch((error) => {
                                client.logger.logError(error);
                            });

                            notifiedOf.push(status.name);
                        } else {
                            if(status.online === false) {
                                const toRemove = notifiedOf.indexOf(status.name);
                                if(toRemove !== -1) {
                                    notifiedOf.splice(toRemove, 1);
                                    if(debug) client.logger.logDebug(`We have removed ${status.name} from notifiedOf[]`);
                                }
                            }
                        }
                    });
                }
            }

            // PICZEL
            if(notify.piczel) {
                for(let user in notify.piczel) {
                    await PiczelAPI.getAPIReturn(notify.piczel[user][0]).then((status) => {
                        currentState.set(status.data[0]['slug'], {'name': status.data[0]['slug'], 'isOnline': status.data[0]['live']});

                        if(!notifiedOf.includes(status.data[0]['slug']) && status.data[0]['live'] === true) {
                            // Notify everyone here
                            client.channels.fetch(notifyChannel).then(channel => {
                                // Ping users with the supplied role IDs of each streamer
                                try {
                                    client.logger.log(`${status.data[0]['slug']} is now online.`);
                                    channel.send({ content: `<@&${notify.piczel[user][1]}>`, embeds: [Notifier.piczelEmbed(status)]});
                                } catch(error) {
                                    client.logger.logError(error);
                                }
                            }).catch((error) => {
                                client.logger.logError(error);
                            });

                            notifiedOf.push(status.data[0]['slug']);
                        } else {
                            if(status.data[0]['live'] === false) {
                                const toRemove = notifiedOf.indexOf(status.data[0]['slug']);
                                if(toRemove !== -1) {
                                    notifiedOf.splice(toRemove, 1);
                                    if(debug) client.logger.logDebug(`We have removed ${status.data[0]['slug']} from notifiedOf[]`);
                                }
                            }
                        }
                    });
                }
            }

            // TWITCH
            if(notify.twitch) {
                for(let user in notify.twitch) {
                    await TwitchAPI.getAPIReturn(notify.twitch[user][0]).then((status) => {
                        // Special handling for Twitch as Twitch returns an empty array if streamer is offline
                        if(status.data && status.data.length) {
                            currentState.set(status.data[0]['user_name'], {'name': status.data[0]['user_name'], 'isOnline': (status.data[0]['type'] === 'live')});

                            if(!notifiedOf.includes(status.data[0]['user_name']) && (status.data[0]['type'] === 'live')) {
                                // Notify everyone here
                                client.channels.fetch(notifyChannel).then(channel => {
                                    // Ping users with the supplied role IDs of each streamer
                                    try {
                                        client.logger.log(`${status.data[0]['user_name']} is now online.`);
                                        channel.send({
                                            content: `<@&${notify.twitch[user][1]}>`,
                                            embeds: [Notifier.twitchEmbed(status)]});
                                    } catch(error) {
                                        client.logger.logError(`${error}\n${error.stack}`);
                                    }
                                }).catch((error) => {
                                    client.logger.logError(`${error}\n${error.stack}`);
                                });

                                notifiedOf.push(status.data[0]['user_name']);
                            } else {
                                if(!(status.data[0]['type'] === 'live')) {
                                    const toRemove = notifiedOf.indexOf(status.data[0]['user_name']);
                                    if(toRemove !== -1) {
                                        notifiedOf.splice(toRemove, 1);
                                        if(debug) client.logger.logDebug(`We have removed ${status.data[0]['user_name']} from notifiedOf[]`);
                                    }
                                }
                            }
                        } else {
                            currentState.set(notify.twitch[user][0], {'name': notify.twitch[user][0], 'isOnline': false});
                        }
                    });
                }
            }

            if(debug) {
                client.logger.logDebug(`Current state: ${JSON.stringify(currentState)}`);
                client.logger.logDebug(`We have notified everyone of: ${JSON.stringify(notifiedOf)}`);
            }

        } catch (error) {
            client.logger.logError(`${error}\n${error.stack}`);
        }
    }, rate);
}

client.login(token);
pingAPI();