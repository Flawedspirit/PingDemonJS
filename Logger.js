/** @module Logger */

/* REQUIRED DEPENDENCIES */
const chalk = require('chalk');

/**
 * @class
 * @classdesc Utility for logging text to the console.
 */
class Logger {
    /**
     * @constructs
     * @param {Boolean} logTimestamps Whether a timestamp should be displayed.
     * @param {String} color A [valid chalk color]{@link https://github.com/chalk/chalk#colors} to use for log output. Defaults to white.
     */
    constructor(logTimestamps, color) {
        this.logTimestamps = !!logTimestamps;
        this.color = color;
    }

    get timestamp() {
        return this.logTimestamps === true ? chalk.whiteBright.bold(`[${new Date().toLocaleString()}] `) : '';
    }

    isValidColor(color) {
        return typeof chalk[color] === 'function';
    }

    /**
     * Logs the provided string parameter to the console.
     *
     * @param {string} message Log message
     * @param {string} [color = "whiteBright"] A [valid chalk color]{@link https://github.com/chalk/chalk#colors}
     */
    log(message, color = "whiteBright") {
        return console.log(this.timestamp + (color ? chalk[color](message) : message));
    }

    /**
     * Logs the provided string parameter to the console with a bolder font.
     *
     * @param {string} message Log message
     * @param {string} [color = 'whiteBright'] A [valid chalk color]{@link https://github.com/chalk/chalk#colors}
     */
    logBold(message, color = "whiteBright") {
        return console.log(this.timestamp + (color ? chalk.bold[color](message) : chalk.bold(message)));
    }

    /**
     * Logs a debug message to the console, indicating information that may be useful
     * for troubleshooting or development purposes.
     *
     * @param {string} message Log message
     * @param {string} [header] [header="DEBUG"] A custom header message before output
     */
    logDebug(message, header = 'DEBUG') {
        return console.log(this.timestamp + chalk.white(`[${header}] ` + message));
    }

    /**
     * Logs an error message to the console, indicating a serious issue that will
     * cause the program to halt execution.
     *
     * @param {string} message Log message
     * @param {string} [header] [header="DEBUG"] A custom header message before output
     */
    logError(message, header = 'ERROR') {
        return console.log(this.timestamp + chalk.bgRed.black(`[${header}] ` + message));
    }

    /**
     * Logs a warning message to the console, indicating an issue that might
     * require intervention to prevent undesired program flow.
     *
     * @param {string} message Log message
     * @param {string} [header] [header="DEBUG"] A custom header message before output
     */
    logWarn(message, header = 'WARN') {
        return console.log(this.timestamp + chalk.bgYellow.black(`[${header}] ` + message));
    }
}

module.exports = Logger;
