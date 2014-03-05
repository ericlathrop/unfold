var rewire = require("rewire");
var fscloner = rewire("./fscloner");
var assert = require("assert");

var FS = require("fs-mock");

function mockFs(structure) {
	var fs = new FS(structure);
	fscloner.__set__("fs", fs);
	return fs;
}

describe("fscloner", function() {
	describe("clone", function() {
		describe("with nonexistant source folder", function() {
			it("should explode", function() {
				mockFs({})
				try {
					fscloner.clone("/src", "/dest", function(src, dest) {});
					throw new Error("should throw an exception");
				} catch(err) {
				}
			});
		});
		describe("with nonexistant destination folder", function() {
			it("should create the destination folder", function() {
				var fs = mockFs({
					"src": { }
				});
				fscloner.clone("/src", "/dest", function(src, dest) {});
				assert.ok(fs.existsSync("/dest"));
			});
		});
		describe("with single file", function() {
			it("should call the copyFunc with the file", function(done) {
				mockFs({
					"src": {
						"a.txt": "hello world"
					}
				});
				fscloner.clone("/src", "/dest", function(src, dest) {
					assert.equal("/src/a.txt", src);
					assert.equal("/dest/a.txt", dest);
					done();
				});
			});
		});
		describe("with file nested in a folder", function() {
			it("should call the copyFunc with the file", function(done) {
				mockFs({
					"src": {
						"a": {
							"b.txt": "hello world"
						}
					}
				});
				fscloner.clone("/src", "/dest", function(src, dest) {
					assert.equal("/src/a/b.txt", src);
					assert.equal("/dest/a/b.txt", dest);
					done();
				});
			});
		});
	});
});
