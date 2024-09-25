class PicartoAPI {
    static async getAPIReturn(input) {
        const APIUrl = 'https://api.picarto.tv/api/v1/channel/name/';

        // Sanitize input to only characters likely to be in a username
        const name = input.replace(/[^A-Za-zÀ-ÿ0-9_-]+/gi, "").trim();
        const response = await fetch(APIUrl.concat("", name));

        return response.json();
    }

    static async PingPicarto (name) {
        PicartoAPI.getAPIReturn(name).then(function (out) {
            if (out.toString() !== 'Channel does not exist') {
                return out;
            }
        });
    }
}
module.exports = PicartoAPI;