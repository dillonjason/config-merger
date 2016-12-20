#!/usr/bin/env node

var ConfigMerger = require('./lib/config-merger.js');
var readPackageJson = require('read-package-json');

function run(){
    readPackageJson('package.json', console.error, false, function (error, data) {
        var missingParameter = [];
        if (!yargs.source)
            missingParameter.push('source');

        if (!yargs.environment)
            missingParameter.push('environment');

        if (!yargs.output)
            missingParameter.push('output');

        if (error && missingParameter.length > 0) {
            console.error('Unable to find package.json and missing parameter(s): ' + missingParameter.join(', '));
            return;
        }
        else {
            if (yargs.configName && data.configMerger && data.configMerger[yargs.configName]) {
                var config = data.configMerger[yargs.configName];
                config.source = config.source.length > 0 ? config.source : yargs.source;
                config.environment = config.environment.length > 0 ? config.environment : yargs.environment;
                config.output = config.output.length > 0 ? config.output : yargs.output;

                missingParameter = [];

                if (!yargs.source)
                    missingParameter.push('source');

                if (!yargs.environment)
                    missingParameter.push('environment');

                if (!yargs.output)
                    missingParameter.push('output');

                if (missingParameter.length > 0) {
                    console.error('Missing parameter(s): ' + missingParameter.join(', '));
                    return;
                }
                else {
                    var config = new ConfigMerger({
                        source: config.source,
                        environment: config.environment,
                        output: config.output
                    });

                    config.save();
                }
            }
            else if (missingParameter.length > 0) {
                console.error('Missing parameter(s): ' + missingParameter.join(', '));
                return;
            }
            else {
                var config = new ConfigMerger({
                    source: yargs.source,
                    environment: yargs.environment,
                    output: yargs.output
                });

                config.save();
            }
        }
    });
}

// This cant be required an used at the moment
run();




