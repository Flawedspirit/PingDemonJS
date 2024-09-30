const { twitchAPI } = require('../config.json');

class TwitchAPI {
    static async getAPIReturn(input) {
        const APIUrl = 'https://api.twitch.tv/helix/streams?user_login=';
        const oauthAPI = 'https://id.twitch.tv/oauth2/token';

        const oauthBody = new URLSearchParams({
            client_id: twitchAPI.client_id,
            client_secret: twitchAPI.secret,
            grant_type: 'client_credentials'
        });

        let accessToken;

        try {
            const response = await fetch(oauthAPI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: oauthBody
            });

            const token = await response.json();
            if(response.ok) {
                accessToken = token.access_token;
            } else {
                console.error(`Error getting token: ${error}\n${error.stack}`);
            }
        } catch(error) {
            console.error(`Request failed: ${error}\n${error.stack}`);
        }

        // Sanitize input to only characters likely to be in a username
        const name = input.replace(/[^A-Za-zÀ-ÿ0-9_-]+/gi, "").trim();

        try {
            const response = await fetch(APIUrl.concat("", name), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Client-Id': `${twitchAPI.client_id}`
                }
            });

            const out = await response.json();
            if(response.ok && out) {
                return out;
            } else {
                console.error(`Request failed: ${error}\n${error.stack}`);
            }
        } catch(error) {
            console.error(`Request failed: ${error}\n${error.stack}`);
        }
    }
}
module.exports = TwitchAPI;