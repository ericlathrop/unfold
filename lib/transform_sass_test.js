"use strict";

var rewire = require("rewire");
var transformSass = rewire("./transform_sass");
var assert = require("assert");
var FS = require("fs-mock");

function mockFs(structure) {
	var fs = new FS(structure);
	transformSass.__set__("fs", fs);
	return fs;
}

describe("transformSass", function() {
	describe("with empty file", function() {
		it("should create an empty file in the destination", function(done) {
			var fs = mockFs({
				"src.scss": ""
			});
			transformSass("/src.scss", "/dest.scss").done(function() {
				var data = fs.readFileSync("/dest.css");
				assert.equal(data, "");
				done();
			});

		});
	});
	describe("with simple sass rule", function() {
		it("should transform to css in destination", function(done) {
			var fs = mockFs({
				"src.scss": "body { width: 5 + 10; }"
			});
			transformSass("/src.scss", "/dest.scss").done(function() {
				var data = fs.readFileSync("/dest.css", { encoding: "utf8" });
				assert.equal(data, "body {\n  width: 15; }\n");
				done();
			});
		});
	});
});
