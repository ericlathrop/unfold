"use strict";

var transformSass = require("./transform_sass");
var assert = require("assert");
var mockFs = require("mock-fs");
var fs = require("fs");

describe("transformSass", function() {
	describe("with empty file", function() {
		it("should create an empty file in the destination", function(done) {
			mockFs({
				"/src.scss": ""
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
			mockFs({
				"/src.scss": "body { width: 5 + 10; }"
			});
			transformSass("/src.scss", "/dest.scss").done(function() {
				var data = fs.readFileSync("/dest.css", { encoding: "utf8" });
				assert.equal(data, "body {\n  width: 15; }\n");
				done();
			});
		});
	});
});
