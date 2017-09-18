#!/usr/bin/env node

var data, lambda;

lambda = require(".");
data = require("./test.json");
lambda.handle(data, {}, function (err) {
    if (err) {
        console.log("ERROR RECEIVED");
        console.log(err.toString());
    } else {
        console.log("DONE");
    }
});
