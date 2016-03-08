#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    nconf = require('nconf'),
    readJson = require('read-package-json'),
    yargs = require('yargs').argv,
    readR = require('./lib/read-recursive');

var NAME = 0;
var ENV = 2;

function noDotFiles(x) {
    return x[0] !== '.' && x.split('.')[x.split('.').length - 1] === 'json';
}

function Configify(options) {
    this.options = Object.assign({
        environment: ''
    }, options);
    this.baseDir = path.join(process.cwd(), this.settings().srcFolder);
    this.outputFile = this.settings().output;
    this.provider = new nconf.Provider().use('file', {file: path.join(this.baseDir, this.outputFile)});
    this.provider.load();

}

Configify.prototype.getProp = function (filename, type) {
    var names = filename.split('.');
    if (type === NAME) {
        return names[NAME];
    }
    if (type === ENV && names.length > 3) {
        return names[ENV]
    } else {
        return ''
    }
};

Configify.prototype.getConfigs = function (files, environment) {
    var self = this;
    return files.filter(function (file) {
        return ((file !== self.outputFile) && (self.getProp(file, ENV) === self.options.environment))
    });
};

Configify.prototype.settings = function () {
    return this.options.config[this.options.configName];

};

Configify.prototype.loadConfigs = function(files){
    var self = this;
    self.getConfigs(files, '').forEach(function (file) {
        console.log(path.join(self.baseDir, file))
        console.log(self.getProp(file, NAME))
        self.provider.merge(self.getProp(file, NAME), JSON.parse(fs.readFileSync(path.join(self.baseDir, file), 'utf8')));
    })

    self.getConfigs(files, process.env.NODE_ENV).forEach(function (file) {
        console.log(path.join(self.baseDir, file))
        console.log(self.getProp(file, NAME))
        self.provider.merge(self.getProp(file, NAME), JSON.parse(fs.readFileSync(path.join(self.baseDir, file), 'utf8')));
    });
}

Configify.prototype.save = function () {
    var self = this;
    var files = readR(self.baseDir, noDotFiles);
    self.loadConfigs(files);
    self.provider.save();
};


function run(){
    readJson('package.json', console.error, false, function (err, data) {
        if (err) {
            console.error("There was an error reading the file");
            return
        }
        var config = new Configify({
            environment: process.env.NODE_ENV,
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




