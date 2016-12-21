#!/usr/bin/env node

var ConfigMerger = require('./lib/config-merger.js');
var readPackageJson = require('read-package-json');
var argv = require('yargs').argv;

function run(){
    readPackageJson('package.json', console.error, false, function (error, data) {
        if (!error && argv.config && data.configmerger && data.configmerger[argv.config]) {
            var jsonConfig = data.configmerger[argv.config];
            jsonConfig.source = hasValue(jsonConfig.source) ? jsonConfig.source : argv.source;
            jsonConfig.environment = hasValue(jsonConfig.environment) ? jsonConfig.environment : argv.environment;
            jsonConfig.output = hasValue(jsonConfig.output) ? jsonConfig.output : argv.output;

            var configFromPackageJSON = new ConfigMerger({
                source: jsonConfig.source,
                environment: jsonConfig.environment,
                output: jsonConfig.output
            });

            attemptSave(configFromPackageJSON);
        }
        else {
            var configFromParams = new ConfigMerger({
                source: argv.source,
                environment: argv.environment,
                output: argv.output
            });

            attemptSave(configFromParams);
        }
    });
}

function attemptSave(config) {
    if (config.hasError)
        console.error(config.errorMessage);
    else {
        config.save();

        if (config.hasError) {
            console.error(config.errorMessage);
        }
    }

}

function hasValue(string) {
    return string !== null && string !== undefined && string.length > 0;
}

// This cant be required an used at the moment
run();
