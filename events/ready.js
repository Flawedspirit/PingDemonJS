/* REQUIRED DEPENDENCIES */
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const PicartoApi = require('../PicartoAPI.js');

/* CONFIGURATION FILE */
require('dotenv').config();

module.exports = {
    name: 'ready',
    execute(client, commandData) {
        const clientId = client.user.id;

        const rest = new REST({
            version: "10"
        }).setToken(process.env.TOKEN);

        (async () => {
            try {
                if (process.env.ENV === "production") {
                    await rest.put(Routes.applicationCommands(clientId), {
                        body: commandData
                    });
                    client.logger.log("Successfully registered commands with scope GLOBAL.");
                } else {
                    await rest.put(Routes.applicationGuildCommands(clientId, process.env.GUILD_ID), {
                        body: commandData
                    });
                    client.logger.log("Successfully registered commands with scope GUILD.");
                }
            } catch (err) {
                if (err) client.logger.logError(err.stack);
            }

            // PicartoApi.PingPicarto(client);

            client.logger.log(`I have successfully started; joining as ${client.user.tag}.`, 'blueBright');
        })();
    }
}