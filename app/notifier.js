const path = require('node:path');
const { EmbedBuilder, MessageAttachment } = require('discord.js');

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
        let matureContent = data.adult ? "Mature content" : "Safe content";
        let time = Date.now();

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
            .setImage(`${data.thumbnails.web}?t=${time}`)
            .setFooter({ text: `${matureContent} | ${data.category[0]}` });
        return embed;
    }

    /**
     * Constructs and returns a Piczel ping embed
     * @param {Object} data A JSON object of stream data returned from the API.
     * @returns {EmbedBuilder}
     */
    static piczelEmbed(data) {
        let isOnline = data.data[0]['live'] ? ":red_circle: ONLINE" : "OFFLINE";
        let matureContent = data.data[0]['adult'] ? "Mature content" : "Safe content";
        let time = Date.now();

        let embed = new EmbedBuilder()
            .setColor(0x09a5c9)
            .setTitle(data.data[0]['username'])
            .setDescription(data.data[0]['title'])
            .setURL(`https://piczel.tv/watch/${data.data[0]['slug']}`)
            .setThumbnail(data.data[0]['user']['avatar']['url'])
            .addFields(
                { name: "Status", value: `${isOnline}`, inline: true },
                { name: "Followers", value: `${data.data[0]['follower_count']}`, inline: true },
                { name: "Watching", value: `${data.data[0]['viewers']}`, inline: true }
            )
            .setImage(`${data.data[0]['preview']['url']}?t=${time}`)
            .setFooter({ text: matureContent });
        return embed;
    }

    /**
     * Constructs and returns a Twitch ping embed
     * @param {Object} data A JSON object of stream data returned from the API.
     * @returns {EmbedBuilder}
     */
    static twitchEmbed(data) {
        let isOnline = (data.data[0]['type'] === 'live') ? ":red_circle: ONLINE" : "OFFLINE";
        let matureContent = data.data[0]['is_mature'] ? "Mature content" : "Safe content";
        let time = Date.now();

        let preview = data.data[0]['thumbnail_url'];
        preview = preview.replace('{width}x{height}', `1200x675`);

        let embed = new EmbedBuilder()
            .setColor(0x6441a5)
            .setTitle(data.data[0]['user_name'])
            .setDescription(data.data[0]['title'])
            .setURL(`https://twitch.tv/${data.data[0]['user_name']}`)
            .setThumbnail('https://files.flawedspirit.ca/ping-demon/assets/glitch_flat_purple.png')
            .addFields(
                { name: "Status", value: `${isOnline}`, inline: true },
                { name: "Watching", value: `${data.data[0]['viewer_count']}`, inline: true }
            )
            .setImage(`${preview}?t=${time}`)
            .setFooter({ text: matureContent });
        return embed;
    }
}
module.exports = Notifier;
