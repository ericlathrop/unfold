var rewire = require("rewire");
var fileCopy = rewire("./file_copy");
var assert = require("assert");
var FS = require("fs-mock");

function mockFs(structure) {
	var fs = new FS(structure);
	fileCopy.__set__("fs", fs);
	return fs;
}

describe("fileCopy", function() {
	describe("with nonexistant source file", function() {
		it("should return a failing promise", function(done) {
			mockFs({});
			fileCopy("/src.txt", "/dest.txt").fail(function(err) {
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
			fileCopy("/src.txt", "/dest").fail(function(err) {
				done();
			});
		});
	});
	describe("with valid source and destination", function() {
		it("should copy the data", function(done) {
			var fs = mockFs({
				"src.txt": "hello world"
			});
			fileCopy("/src.txt", "/dest.txt").done(function() {
				assert.equal("hello world", fs.readFileSync("/src.txt"));
				done();
			});
		});
	});
});
