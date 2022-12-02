class PicartoAPI {
    static async getApiReturn(input) {
        const apiUrl = "https://api.picarto.tv/api/v1/channel/name/";

        // Sanitize input to only characters likely to be in a username
        let name = input.replace(/[^A-Za-zÀ-ÿ0-9_-]+/gi, "").trim();
        let response = await fetch(apiUrl.concat("", name));

        return response.json();
    }
}

module.exports = PicartoAPI;
