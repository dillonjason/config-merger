
var fs    = require('fs'),
    path  = require('path'),
    nconf = require('nconf'),
    readJson = require('read-package-json'),
    yargs = require('yargs').argv;

var outputFile = 'config.json'
var NAME = 0;
var ENV = 2;

function Configify(options){
    this.options = Object.assign({
        environment: ''
    }, options);

}

Configify.prototype.getProp = function(filename, type) {
    var names = filename.split('.');
    if(type === NAME){
        return names[NAME];
    }
    if(type === ENV && names.length > 3){
        return names[ENV]
    }else{
        return ''
    }
};

Configify.prototype.getConfigs = function(files, environment){
    var self = this;
    return files.filter(function(file){
        return ((file !== outputFile) && (self.getProp(file, ENV) === self.options.environment))
    });
};

Configify.prototype.settings = function(){
    return this.options.config[this.options.configName];

}

Configify.prototype.save = function(){
    var self = this;
    var folder = path.join(__dirname, this.settings().srcFolder);
    var outputFile = this.settings().output;
    fs.readdir(folder, function(err, files) {
        if(err){
            console.error(err.message)
            return;
        }

        var provider = new nconf.Provider().use('file', {file: path.join(folder, outputFile)});
        provider.load();
        //gets the base configs
        //console.log(files)

        self.getConfigs(files,'').forEach(function(file){
            console.log(path.join(__dirname, folder,  file))
            console.log(self.getProp(file, NAME))
            provider.merge(self.getProp(file, NAME), JSON.parse(fs.readFileSync(path.join(folder,  file), 'utf8')));
        })

        self.getConfigs(files, process.env.NODE_ENV).forEach(function(file){
            console.log(path.join(__dirname, folder,  file))
            console.log(self.getProp(file, NAME))
            provider.merge(self.getProp(file, NAME), JSON.parse(fs.readFileSync(path.join(folder,  file), 'utf8')));
        });

        provider.save();


    });

}








readJson('package.json', console.error, false, function (er, data) {
    if (er) {
        console.error("There was an error reading the file")
        return
    }
    console.log(process.argv)
    console.error('the package data is', data)


    var config = new Configify({
        environment: process.env.NODE_ENV,
        configName: yargs.config,
        config: data.configify.find(function(item) {
            return !!item[yargs.config];
        })
    })

    config.save()






});


//
//var provider = new nconf.Provider().use('file', {file: 'config.json'});
//
//provider.load();
//
//
//var baseOverride = JSON.parse(fs.readFileSync('base.config.json'), 'utf8');
//
//provider.merge('base',baseOverride);
//
//var devOverride = JSON.parse(fs.readFileSync('dev.config.json'), 'utf8');
//
//provider.merge('dev',devOverride);
//
//provider.save(function(){
//
//    var stuff = require('./config.json')
//    console.log('hello ' , stuff.name)
//});


