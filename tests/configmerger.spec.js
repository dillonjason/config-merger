var assert = require('assert');
var ConfigMerger = require('../lib/config-merger.js');
var sinon = require('sinon');
var fs = require('fs');

describe("ConfigMerger", function () {
    describe("Init", function () {
        it("Should construct with all values in options", function () {
            assert.doesNotThrow(function () {
                new ConfigMerger({
                    source: './configs',
                    output: './test/app.config.json',
                    environment: 'test'
                })
            });
        });

        it("Should have an error with missing parameter", function () {
            var configMerger = new ConfigMerger({
                output: './test/app.config.json',
                environment: 'test'
            });

            assert.equal(configMerger.hasError, true);
        });
    });

    describe("getMerged", function () {
        var configMerger = new ConfigMerger({
            source: './configs',
            output: './test/app.config.json',
            environment: 'test'
        });

        it("Should merge multiple base config without error", function () {
            assert.doesNotThrow(function () {
                configMerger.getMerged('/*.config.json');
            });
        });

        it("Should merge single base config without error", function () {
            assert.doesNotThrow(function () {
                configMerger.getMerged('/config.json');
            });
        });

        it("Should throw error when file not found", function () {
            var configMerger = new ConfigMerger({
                source: './configs',
                output: './test/app.config.json',
                environment: 'test'
            });

            configMerger.getMerged('not-a-file-name', function () {
                assert.equal(configMerger.hasError, true);
            });
        });
    });

    describe('Save', function() {
        var configMerger = new ConfigMerger({
            source: './configs',
            output: './test/app.config.json',
            environment: 'test'
        });

        it("Should create and read without error", function () {
            configMerger.save(function () {
                fs.readFile('./test/app.config.json', function (error, context) {
                    assert.equal(error, false);
                })
            });
        });

        it("Should create config using just base", function () {
            configMerger.save(function () {
                fs.readFile('./test/app.config.json', function (error, context) {
                    var obj = JSON.parse(context);
                    assert.equal(obj.defaultError, "An unknown error has occurred");
                })
            });
        });

        it("Should create config that is not the base", function () {
            configMerger.environment = "dev";
            configMerger.save(function () {
                fs.readFile('./test/app.config.json', function (error, context) {
                    var obj = JSON.parse(context);
                    assert.notEqual(obj.defaultError, "An unknown error has occurred");
                })
            });
        });

        it("Should create config using dev base", function () {
            configMerger.environment = "dev";
            configMerger.save(function () {
                fs.readFile('./test/app.config.json', function (error, context) {
                    var obj = JSON.parse(context);
                    assert.equal(obj.defaultError, "An unknown error has a Development Issue");
                })
            });
        });

        it("Should create config using production base", function () {
            configMerger.environment = "production";
            configMerger.save(function () {
                fs.readFile('./test/app.config.json', function (error, context) {
                    var obj = JSON.parse(context);
                    assert.equal(obj.defaultError, "An unknown error has a Production Issue");
                })
            });
        });
    })
});
