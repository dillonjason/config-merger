#!/usr/bin/env node

var ConfigMerger = require('./lib/config-merger.js');
var readPackageJson = require('read-package-json');

function run(){
    readPackageJson('package.json', console.error, false, function (error, data) {
        if (!error && yargs.configName && data.configMerger && data.configMerger[yargs.configName]) {
            var jsonConfig = data.configMerger[yargs.configName];
            jsonConfig.source = jsonConfig.source.length > 0 ? jsonConfig.source : yargs.source;
            jsonConfig.environment = jsonConfig.environment.length > 0 ? jsonConfig.environment : yargs.environment;
            jsonConfig.output = jsonConfig.output.length > 0 ? jsonConfig.output : yargs.output;

            var configFromPackageJSON = new ConfigMerger({
                source: jsonConfig.source,
                environment: jsonConfig.environment,
                output: jsonConfig.output
            });

            attemptSave(configFromPackageJSON);
        }
        else {
            var configFromParams = new ConfigMerger({
                source: yargs.source,
                environment: yargs.environment,
                output: yargs.output
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

// This cant be required an used at the moment
run();




