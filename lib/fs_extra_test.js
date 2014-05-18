"use strict";

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
				mockFs({});
				fsExtra.clone("/src", "/dest", function() {}).fail(function() {
					done();
				});
			});
		});
		describe("with nonexistant destination folder", function() {
			it("should create the destination folder", function(done) {
				var fs = mockFs({
					"src": { }
				});
				fsExtra.clone("/src", "/dest", function() {}).done(function() {
					assert.ok(fs.existsSync("/dest"));
					done();
				});
			});
			describe("with one source file", function() {
				it("should create the destination folder before copying the file", function(done) {
					var fs = mockFs({
						"src": {
							"a.txt": "hello world"
						}
					});
					fsExtra.clone("/src", "/dest", function(file) {
						if (file === "/src/a.txt") {
							assert.ok(fs.existsSync("/dest"));
						}
					}).done(function() {
						done();
					});
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
					assert.equal(src, "/src/a.txt");
					assert.equal(dest, "/dest/a.txt");
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
					fsExtra.clone("/src", "/dest", function() {
						return 42;
					}).done(function(val) {
						assert.equal(val, 42);
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
					assert.equal(src, "/src/a/b.txt");
					assert.equal(dest, "/dest/a/b.txt");
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
				fsExtra.copy("/src.txt", "/dest.txt").fail(function() {
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
				fsExtra.copy("/src.txt", "/dest").fail(function() {
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
					assert.equal(fs.readFileSync("/src.txt"), "hello world");
					done();
				});
			});
		});
	});
	describe("readDirRecursive", function() {
		describe("with nonexistant folder", function() {
			it("should return a failing promise", function(done) {
				fsExtra.readDirRecursive("/notThere").fail(function() {
					done();
				});
			});
		});
		describe("with file", function() {
			it("should return a promise that yields an array with the filename", function(done) {
				mockFs({
					"src.txt": "hello world"
				});
				fsExtra.readDirRecursive("/src.txt", function(path) {
					return path;
				}).done(function(data) {
					assert.deepEqual(data, ["/src.txt"]);
					done();
				});
			});
		});
		describe("with a directory and a file inside", function() {
			it("should return a promise that yields an array with the filenames", function(done) {
				mockFs({
					"dir": {
						"a.txt": "hello world",
						"sub": {
							"b.txt": "hello world",
						}
					}
				});
				fsExtra.readDirRecursive("/dir", function(path) {
					return path;
				}).done(function(data) {
					assert.deepEqual(data, ["/dir", "/dir/a.txt", "/dir/sub", "/dir/sub/b.txt"]);
					done();
				});
			});
		});
	});
	describe("readDirFiles", function() {
		describe("with a directory with files and directories inside", function() {
			it("should return a promise that yields an array of the file names", function(done) {
				mockFs({
					"dir": {
						"a.txt": "hello world",
						"sub": {
							"b.txt": "hello world",
						}
					}
				});
				fsExtra.readDirFiles("/dir").done(function(data) {
					assert.deepEqual(data, ["/dir/a.txt", "/dir/sub/b.txt"]);
					done();
				});
			});
		});
	});
});
