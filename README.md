# Ping Demon
## A bot for monitoring Picarto and Piczel streamers

(Twitch and Youtube support coming Soon™️)

![Static Badge](https://img.shields.io/badge/Ping%20Demon-1.1.6-darkred)

### Getting Started
**Note:** This guide assumes you are familiar with the concept of creating a Discord application, as well as developer mode in Discord.

**1. Create a Discord Application**\
i. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and create a new application. You will be shown your application token. Copy this down for now, as you will not be shown it again.\
ii. By default, Installation Contexts is set to `Guild Install`, Scopes is `applications.commands` and `bots`, and Permissions needed are `Embed Links`, `Mention Everyone`, `Send Messages`, `Send Messages in Threads`, and `Use Slash Commands`.\
iii. Set the bot's details in the Bot tab.

**2. Deploy the Bot**\
You will require a server running at least `nodejs >= 18.17`.\
Run the following commands:\
- `git clone https://github.com/Flawedspirit/PingDemonJS.git && cd PingDemonJS`
- `npm install`

**3. Configure the Bot**\
Rename or copy the `config.json.dist` file to `config.json`.\
By default, the bot works with RoleIDs to ping specific roles when a streamer comes online, as well a provided ChannelID to post notifications in.
The following fields need to be updated to work for your server:\
- `token`: Your Discord application token from step 1.
- `notify["picarto/piczel"]`: Provide an array of a user and RoleID to ping for that user, ie `["username", "123456789123456789"]`.
- `notifyChannel`: Provide a channel ID for the bot to post messages in.
- `pingRate`: The rate in seconds to ping the streaming service APIs. Defaults to 10 seconds. The minimum allowed value is 5 seconds.\
The remaining fields can be left as-is.

**4. Run the Bot**
The bot can be run like any other NPM application, with `node .`\
If everything is configured right, the bot will start and be running.

It is recommended to use a service manager like PM2 to run the bot in the background on your server, and handle automatic restarting if needed.
