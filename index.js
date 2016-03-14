#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    nconf = require('nconf'),
    readJson = require('read-package-json'),
    yargs = require('yargs').argv,
    ConfigMerger = require('./lib/config-merger.js');

var readRecursive = require('./lib/read-recursive');
var NAME = 0;
var ENV = 2;


function run(){
    readJson('package.json', console.error, false, function (err, data) {
        if (err) {
            console.error("There was an error reading the file");
            return
        }
        var config = new ConfigMerger(fs, path, nconf, readRecursive, {
            environment: yargs.environment,
            configName: yargs.config,
            config: data.configmerger.find(function (item) {
                return !!item[yargs.config];
            })
        });
        config.save()
    });
}

//this cant be required an used at the moment
run();




