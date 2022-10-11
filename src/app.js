/* REQUIRE NODE 16.9.0+ TO USE THE BOT */
if (parseFloat(process.versions.node) < 16.9) throw new Error('Incompatible Node.js version. Please use version 16.9.0 or higher.');

/* REQUIRED DEPENDENCIES */
const { Client, GatewayIntentBits, Collection, ReactionUserManager } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const Logger = require(path.join(__dirname, 'Logger.js'));

/* CONFIGURATION FILE */
require('dotenv').config();

const token = process.env.TOKEN;
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

client.logger = new Logger(eval(process.env.LOG_TIMESTAMPS));

/* INITIALIZE COMMANDS */
client.commands = new Collection();
const commandData = [];

const commandDir = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandDir).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandDir, `${file}`));
    commandData.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
    client.logger.log(`Registered command: ${command.data.name}`);
}

/* INITIALIZE EVENT HANDLERS */
const eventDir = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventDir).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(path.join(eventDir, `${file}`));
    client.logger.log(`Registered event handler: ${event.name}`);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, commandData));
    } else {
        client.on(event.name, (...args) => event.execute(...args, commandData));
    }
}

client.login(token);
