var fs = require('fs');
var async = require('async');
var glob = require('glob');
var deepmerge = require('deepmerge');

function ConfigMerger(options) {
    this.hasError = false;
    this.errorMessage = '';

    var missingOptions = [];

    if (!options.source)
        missingOptions.push('source');

    if (!options.environment)
        missingOptions.push('environment');

    if (!options.output)
        missingOptions.push('output');

    if (missingOptions.length > 0) {
        var missingOptionsString = missingOptions.length === 1 ? '' : 's';
        this._setError('Missing parameter' + missingOptionsString + ': ' + missingOptions.join(', '));
    }
    else {
        this.source = options.source;
        this.environment = options.environment;
        this.output = options.output;
    }
}

ConfigMerger.prototype._setError = function (message) {
  this.errorMessage = message;
  this.hasError = true;
};

ConfigMerger.prototype.save = function (cb) {
    var self = this;
    console.log('Merging base configs...');
    self.getMerged('/*.config.json', function(baseConfig) {
        console.log('Merging ' + self.environment + ' configs...');
        self.getMerged('/*.config.' + self.environment + '.json', function(envConfig) {
           var appConfig = deepmerge(baseConfig, envConfig);
           console.log('Writing config...');
           fs.writeFile(self.output, JSON.stringify(appConfig, null, 2), function(error) {
               if (error) {
                   self._setError('Unable to save output to ' + self.output);
               }
               else {
                   console.log('Successfully Generated ' + self.output);
                   if (cb)
                       return cb();
                   else
                       return true;
               }
           })
       })
    });
};

ConfigMerger.prototype.getMerged = function (fileName, callback) {
    var self = this;
    glob(self.source + fileName, null, function (error, files) {
        if (error || files.length === 0) {
            self._setError('Unable to find config files at ' + self.source + fileName);
        }
        else {
            var configs = [];
            async.eachSeries(files,
                // Function for each file path
                function (filename, cb) {
                    fs.readFile(filename, function (error, content) {
                        if (error) {
                            console.error('Unable to read ' + filename);
                        }
                        else {
                            configs.push(JSON.parse(content));
                        }
                        // cb calls next item im list
                        cb(error);
                    });
                },
                // Function after all files parsed
                function () {
                    callback(configs.length === 1 ? configs[0] : deepmerge.all(configs));
                }
            );
        }
    })
};

module.exports = ConfigMerger;




