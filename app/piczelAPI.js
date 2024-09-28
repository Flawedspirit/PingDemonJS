class PiczelAPI {
    static async getAPIReturn(input) {
        const APIUrl = 'https://piczel.tv/api/streams/';

        // Sanitize input to only characters likely to be in a username
        const name = input.replace(/[^A-Za-zÀ-ÿ0-9_-]+/gi, "").trim();
        const response = await fetch(APIUrl.concat("", name), { headers: {'pragma': 'no-cache', 'cache-control': 'no-cache' }});

        return response.json();
    }

    static async PingPiczel (name) {
        PiczelAPI.getAPIReturn(name).then(function (out) {
            if (out.status.toString() !== 'error') {
                return out;
            }
        });
    }
}
module.exports = PiczelAPI;