var assert = require('assert');

var utils = require('../lib/utils');


describe("utils objects", function() {
  describe("#noDotFiles", function() {
    it("should return false given a string with a dot as the first character", function() {
      var testInput = ".testFile";
      var actual = utils.noDotFiles(testInput);
      assert(actual === false);
    });

    it("should return false given a string with a extension of anything other than json", function() {
      var testInput = "testFile.txt";
      var actual = utils.noDotFiles(testInput);
      assert(actual === false);
    });


  })
})
