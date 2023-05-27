/* REQUIRE NODE 16.9.0+ TO USE THE BOT */
if (parseFloat(process.versions.node) < 18) throw new Error('Incompatible Node.js version. Please use version 18.0.0 or higher.');

/* REQUIRED DEPENDENCIES */
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const Logger = require('./Logger.js');
const PicartoAPI = require('./PicartoAPI.js');

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

async function handleError (interaction, error) {
    if (error) {
        interaction.client.logger.logError(error.stack);
        await interaction.reply({ content: `Ow! Something went wrong executing that command! Please let an admin know this happened:\n\`\`\`${error.stack}\`\`\``, ephemeral: true });
    }
}
exports.handleError = handleError;

/* RUN MAIN SYSTEM LOOP */
async function pingAPI() {
    let rate = process.env.API_WAIT_SECONDS * 1000;
    rate = Math.max(rate, 2500); // Clamp lower value of rate to 2.5 seconds  to avoid hitting rate limit

    setInterval(async () => {
        try {
            PicartoAPI.PingPicarto(client, "kazerad");
        } catch (error) {
            console.error("Error occurred while logging: ", error);
        }
    }, rate);
}

// /* INITIALIZE COMPONENTS */
// client.buttons = new Collection();
// const componentData = [];

// const componentDir = path.join(__dirname, 'components');
// const componentFiles = fs.readdirSync(componentDir).filter(file => file.endsWith('.js'));

// for (const file of componentFiles) {
//     const component = require(path.join(componentDir, `${file}`));
//     componentData.push(component.data.toJSON());
//     client.component.set(component.data.name, component);
//     client.logger.log(`Registered component: ${command.data.name}`);
// }

client.login(token);
pingAPI();
