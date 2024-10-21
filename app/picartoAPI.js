class PicartoAPI {
    static async getAPIReturn(input) {
        const APIUrl = 'https://api.picarto.tv/api/v1/channel/name/';

        // Sanitize input to only characters likely to be in a username
        const name = input.replace(/[^A-Za-zÀ-ÿ0-9_-]+/gi, "").trim();
        const response = await fetch(APIUrl.concat("", name), { headers: {'pragma': 'no-cache', 'cache-control': 'no-cache' }});

        return response.json();
    }
}
module.exports = PicartoAPI;