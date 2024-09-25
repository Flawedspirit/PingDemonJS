const { EmbedBuilder } = require('discord.js');

/**
 * @class
 * @classdesc Utility for constructing Discord notification embeds.
 */
class Notifier {
    /**
     * Constructs and returns a Picarto ping embed
     * @param {Object} data A JSON object of stream data returned from the API.
     * @returns {EmbedBuilder}
     */
    static picartoEmbed(data) {
        let isOnline = data.online ? ":red_circle: ONLINE" : "OFFLINE";

        let embed = new EmbedBuilder()
            .setColor(0x35a775)
            .setTitle(data.name)
            .setDescription(data.title)
            .setURL(`https://picarto.tv/${data.name}`)
            .setThumbnail(data.avatar)
            .addFields(
                { name: "Status", value: `${isOnline}`, inline: true },
                { name: "Followers", value: `${data.followers}`, inline: true },
                { name: "Watching", value: `${data.viewers}`, inline: true }
            )
            .setImage(data.thumbnails.web);
        return embed;
    }

    /**
     * Constructs and returns a Piczel ping embed
     * @param {Object} data A JSON object of stream data returned from the API.
     * @returns {EmbedBuilder}
     */
    static piczelEmbed(data) {
        let isOnline = data.data[0]['live'] ? ":red_circle: ONLINE" : "OFFLINE";

        let embed = new EmbedBuilder()
            .setColor(0x09a5c9)
            .setTitle(data.data[0]['username'])
            .setDescription(data.data[0]['title'])
            .setURL(`https://picarto.tv/${data.data[0]['slug']}`)
            .setThumbnail(data.data[0]['user']['avatar']['url'])
            .addFields(
                { name: "Status", value: `${isOnline}`, inline: true },
                { name: "Followers", value: `${data.data[0]['follower_count']}`, inline: true },
                { name: "Watching", value: `${data.data[0]['viewers']}`, inline: true }
            )
            .setImage(data.data[0]['preview']['url']);
        return embed;
    }
}
module.exports = Notifier;
