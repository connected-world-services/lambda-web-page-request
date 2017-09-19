"use strict";

var request;

function handler(event, context, callback) {
    var dryRun, config, pageRequestConfig, url;

    // When using CloudWatch, the config is passed as an event using the
    // "Constant (JSON text)" option. For clarity, rename here. It's already
    // parsed into an object.
    config = event;

    if (config.dryRun) {
        dryRun = true;
        console.log("Enabling dry run mode.");
    }

    if (!config.urlTemplate) {
        return callback(new Error("Missing `urlTemplate` parameter in JSON config."));
    }

    // Pass 'true' to always use UTC.
    url = new Date().format(config.urlTemplate, true);
    console.log("URL: " + url);

    // Build a request
    pageRequestConfig = {
        url: url
    };

    if (config.method) {
        pageRequestConfig.method = config.method;
    }

    if (config.username || config.password) {
        pageRequestConfig.username = config.username;
        pageRequestConfig.password = config.password;
    }

    // Make the request
    if (dryRun) {
        console.log("Aborting now. Dry run was enabled.");

        return callback();
    }

    request(pageRequestConfig, function (error, response, body) {
        var parsed;

        if (error) {
            console.log("Error reported: " + error.toString());

            return callback(error);
        }

        console.log("Status code: " + response.statusCode);
        console.log(body);

        if (response.statusCode < 200 || response.statusCode > 299) {
            return callback(new Error("Response code indicates error."));
        }

        // The response body should be JSON.
        try {
            parsed = JSON.parse(body);
        } catch (e) {
            return callback(new Error("Unable to parse response body JSON"));
        }

        if (!parsed.accepted) {
            return callback(new Error("Snapshot request was not accepted."));
        }

        callback();
    });
}

require("date.format");
request = require("request");

module.exports = {
    handler: handler
};
