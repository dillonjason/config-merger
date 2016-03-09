var assert = require('assert');


var ConfigMerger = require('../lib/config-merger.js');



describe("configify object", function(){
  beforeEach(function(){
    var path = {
      join: function(){ return "/Users/davidmoody/Projects"; }
    }
    var fs = {}
    var nconf = {
      Provider: function(){
        var thing = {
          use: function() {
            var thang = {
              load: function() {
                return true;
              }
            }
            return thang;
          }
        }
        return thing;
      }
    }

    var reader = function(){
      return [];
    }
    this.configMerger = new ConfigMerger(fs, path, nconf, reader, {
      environment: 'production',
      configName: 'company1',
      config:{
        company1: {
          output: "app.config.json",
          srcFolder: "company1_configs"
        }
      }
    });

  });

  it("can be newed up and ready to go", function(){
    assert(!!this.configMerger == true);
  });

  it("should set the output param", function() {
    assert(!!this.configMerger.settings().output == true)

  });


  it("should set the srcFolder param", function() {
    assert(!!this.configMerger.settings().srcFolder == true);
  });


})
