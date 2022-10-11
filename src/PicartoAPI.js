const axios = require("axios");

class PicartoAPI {

    static async getApiReturn(input) {
        const apiUrl = "https://api.picarto.tv/api/v1/channel/name/";

        let name = input.replace(/[^A-Za-zÀ-ÿ0-9_-]+/gi, "").trim();

        axios.get(apiUrl.concat("", name)).then(function (response) {
            return JSON.parse(response);
        }).catch(function (error) {
            return error.stack;
        });
    }
}

module.exports = PicartoAPI;
