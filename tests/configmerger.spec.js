var assert = require('assert');
var ConfigMerger = require('../lib/config-merger.js');
var sinon = require('sinon');



describe("configify object", function(){
  function myPathStub(){
    return {
      join: function(){ return "/Users/davidmoody/Projects"; }
    }
  }
  function myFsStub() {
    return {};
  }

  function mynconfStub() {
    return {
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
  }
  function myReaderStub() {
    var reader = function(){
      return [];
    }
  }
  beforeEach(function(){
    var fs = myFsStub();
    var path = myPathStub();
    var nconf = mynconfStub();
    var reader = myReaderStub();

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
