var fs = require('fs');
var path = require('path');
var nconf = require('nconf');
var utils = require('./utils.js');

var NAME = 0;
var ENV = 2;

function ConfigMerger(options) {
  if (!options.source)
  this.fs = fs;
  this.path = path;
  this.filter = utils.noDotFiles;
  this.reader = reader;
  this.options = Object.assign({
    environment: ''
  }, options);
  this.baseDir = path.join(process.cwd(), this.settings().srcFolder);
  this.outputFile = this.settings().output;
  this.provider = new nconf.Provider().use('file', {file: path.join(process.cwd(), this.outputFile)});
  this.provider.load();

}

ConfigMerger.prototype.getProp = function (filename, type) {
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

ConfigMerger.prototype.getConfigs = function (files, environment) {
  var self = this;
  return files.filter(function (file) {
    return ((file !== self.outputFile) && (self.getProp(file, ENV) === environment))
  });
};

ConfigMerger.prototype.settings = function () {
  return this.options.config[this.options.configName];
};

ConfigMerger.prototype.mergeFile = function(file) {
  var self = this;
  var filePath = self.path.join(self.baseDir, file);
  console.log('merging %s into output config', filePath);
  self.provider.merge(self.getProp(file, NAME), JSON.parse(self.fs.readFileSync(filePath, 'utf8')));
};

ConfigMerger.prototype.mergeFiles = function(files, env){
  var self = this;
  self.getConfigs(files, env).forEach(function (file) {
    self.mergeFile(file);
  })
};

ConfigMerger.prototype.loadConfigs = function(files){
  var self = this;
  this.mergeFiles(files,'');
  this.mergeFiles(files, this.options.environment);
};

ConfigMerger.prototype.save = function () {
  var self = this;
  var files =self.reader(self.baseDir, self.filter);
  self.loadConfigs(files);
  self.provider.save();
};



function format(time) {
  return time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
}


module.exports = ConfigMerger;




