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
			it("should return a failing promise", function(done) {
				mockFs({})
				fscloner.clone("/src", "/dest", function(src, dest) {}).then(function() {
				}).fail(function(reason) {
					done();
				});
			});
		});
		describe("with nonexistant destination folder", function() {
			it("should create the destination folder", function(done) {
				var fs = mockFs({
					"src": { }
				});
				fscloner.clone("/src", "/dest", function(src, dest) {}).done(function() {
					assert.ok(fs.existsSync("/dest"));
					done();
				});
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
				}).done();
			});
			describe("with a copyFunc that returns a value", function() {
				it("should return the value", function(done) {
					mockFs({
						"src": {
							"a.txt": "hello world"
						}
					});
					fscloner.clone("/src", "/dest", function(src, dest) {
						return 42;
					}).done(function(val) {
						assert.equal(42, val);
						done();
					});
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
				}).done();
			});
		});
	});
});
