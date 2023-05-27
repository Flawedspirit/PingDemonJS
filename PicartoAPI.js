/** @module PicartoAPI */
class PicartoAPI {
    static async #getApiReturn (input) {
        const apiUrl = "https://api.picarto.tv/api/v1/channel/name/";

        // Sanitize input to only characters likely to be in a username
        const name = input.replace(/[^A-Za-zÀ-ÿ0-9_-]+/gi, "").trim();
        const response = await fetch(apiUrl.concat("", name));

        return response.json();
    }

    static async registerNotifier (interaction) {
        return await interaction.reply({ content: `You clicked the ${interaction.customId} button!`, ephemeral: true });
    }

    /**
     * Pings the Picarto API every X milliseconds and returns whether the provided streamer is online.
     * @param {Client} client Discord.js client
     * @param {string} name string
     */
    static async PingPicarto (client, name) {
        PicartoAPI.#getApiReturn(name).then(function (out) {
            if (out.toString() !== "Channel does not exist") {
                return out.online;
            }
        });
    }
}
module.exports = PicartoAPI;
