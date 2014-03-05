var rewire = require("rewire");
var fscloner = rewire("./fscloner");
var assert = require("assert");

var FS = require("fs-mock");

describe("fscloner", function() {
	describe("clone", function() {
		describe("with nonexistant source folder", function() {
			it("should explode", function() {
				var fs = new FS({});
				fscloner.__set__("fs", fs);
				try {
					fscloner.clone("/src", "/dest", function(src, dest) {});
					throw new Error("should throw an exception");
				} catch(err) {
				}
			});
		});
		describe("with single file", function() {
			it("should call the copyFunc with the file", function(done) {
				var fs = new FS({
					"src": {
						"a.txt": "hello world"
					}
				});
				fscloner.__set__("fs", fs);
				fscloner.clone("/src", "/dest", function(src, dest) {
					assert.equal("/src/a.txt", src);
					assert.equal("/dest/a.txt", dest);
					done();
				});
			});
		});
	});
});
