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
        this._setError('Missing parameter' + missingOptions.length === 1 ? '' : 's' + ': ' + missingOptions.join(', '));
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
    this.getMerged('/*.config.json', function(baseConfig) {
       this.getMerged('/*.config.' + this.environment + '.json', function(envConfig) {
           var appConfig = deepmerge(baseConfig, envConfig);
           fs.writeFile(this.output, JSON.stringify(appConfig), function(error) {
               if (error) {
                   this._setError('Unable to save output to ' + this.output);
               }
               else {
                   console.log('Successfully Generated ' + this.output);
                   cb();
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
            var baseConfigs = [];
            async.eachSeries(files,
                // Function for each file path
                function (filename, cb) {
                    fs.readFile(filename, function (error, content) {
                        if (error) {
                            console.error('Unable to read ' + filename);
                        }
                        else {
                            baseConfigs.push(JSON.parse(content));
                        }
                        // cb calls next item im list
                        cb(error);
                    });
                },
                // Function after all files parsed
                function () {
                    callback(deepmerge.all(baseConfigs));
                }
            );
        }
    })
};

module.exports = ConfigMerger;




