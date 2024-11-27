const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');
const { clientId, logTimestamps, token } = require('./config.json');

const Logger = require('./app/logger.js');
logger = new Logger(logTimestamps);

const commands = [];
const commandDirPath = path.join(__dirname, 'app/commands');
const commandDirs = fs.readdirSync(commandDirPath);


for(const dir of commandDirs) {
    const commandPath = path.join(commandDirPath, dir);
    const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

    // Grab the SlashCommandBuilder#toJSON output of each command's data for deployment
    for(const file of commandFiles) {
        const filePath = path.join(commandPath, file);
        const command = require(filePath);
        logger.log(`Registered command: ${filePath}`);

        // Create a new item in the array with the command data as a JSON object
        if('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            logger.logWarn(`[WARN] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const rest = new REST().setToken(token);

// Deploy the commands
(async () => {
    try {
        logger.log(`Registering ${commands.length} application (/) commands.`);

        await rest.put(
            Routes.applicationCommands(clientId), { body: commands }
        );
        logger.log(`Successfully registered application (/) commands.`);
    } catch(error) {
        logger.logError(error);
    }
})();