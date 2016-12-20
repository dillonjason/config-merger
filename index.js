#!/usr/bin/env node

var ConfigMerger = require('./lib/config-merger.js');
var readPackageJson = require('read-package-json');

function run(){
    readPackageJson('package.json', console.error, false, function (error, data) {
        if (!error && yargs.configName && data.configMerger && data.configMerger[yargs.configName]) {
            var config = data.configMerger[yargs.configName];
            config.source = config.source.length > 0 ? config.source : yargs.source;
            config.environment = config.environment.length > 0 ? config.environment : yargs.environment;
            config.output = config.output.length > 0 ? config.output : yargs.output;

            var config = new ConfigMerger({
                source: config.source,
                environment: config.environment,
                output: config.output
            });

            if (config.hasError)
                console.error(config.errorMessage);
            else
                config.save();
        }
        else {
            var config = new ConfigMerger({
                source: yargs.source,
                environment: yargs.environment,
                output: yargs.output
            });

            if (config.hasError)
                console.error(config.errorMessage);
            else
                config.save();
        }
    });
}

// This cant be required an used at the moment
run();




