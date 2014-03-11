var rewire = require("rewire");
var fsExtra = rewire("./fs_extra");
var assert = require("assert");
var FS = require("fs-mock");

function mockFs(structure) {
	var fs = new FS(structure);
	fsExtra.__set__("fs", fs);
	return fs;
}

describe("fsExtra", function() {
	describe("clone", function() {
		describe("with nonexistant source folder", function() {
			it("should return a failing promise", function(done) {
				mockFs({})
				fsExtra.clone("/src", "/dest", function(src, dest) {}).then(function() {
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
				fsExtra.clone("/src", "/dest", function(src, dest) {}).done(function() {
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
				fsExtra.clone("/src", "/dest", function(src, dest) {
					assert.equal("/src/a.txt", src);
					assert.equal("/dest/a.txt", dest);
				}).done(function() {
					done();
				});
			});
			describe("with a copyFunc that returns a value", function() {
				it("should return the value", function(done) {
					mockFs({
						"src": {
							"a.txt": "hello world"
						}
					});
					fsExtra.clone("/src", "/dest", function(src, dest) {
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
				fsExtra.clone("/src", "/dest", function(src, dest) {
					assert.equal("/src/a/b.txt", src);
					assert.equal("/dest/a/b.txt", dest);
				}).done(function() {
					done();
				});
			});
		});
	});
	describe("copy", function() {
		describe("with nonexistant source file", function() {
			it("should return a failing promise", function(done) {
				mockFs({});
				fsExtra.copy("/src.txt", "/dest.txt").fail(function(err) {
					done();
				});
			});
		});
		describe("with valid source, but destination is a directory", function() {
			it("should return a failing promise", function(done) {
				mockFs({
					"src.txt": "hello world",
					"dest": {}
				});
				fsExtra.copy("/src.txt", "/dest").fail(function(err) {
					done();
				});
			});
		});
		describe("with valid source and destination", function() {
			it("should copy the data", function(done) {
				var fs = mockFs({
					"src.txt": "hello world"
				});
				fsExtra.copy("/src.txt", "/dest.txt").done(function() {
					assert.equal("hello world", fs.readFileSync("/src.txt"));
					done();
				});
			});
		});
	});
});
