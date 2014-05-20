"use strict";

var rewire = require("rewire");
var loadPartials = rewire("./load_partials");
var handlebars = require("handlebars");
var assert = require("assert");
var FS = require("fs-mock");
var fsExtra = rewire("./fs_extra");

function mockFs(structure) {
	var fs = new FS(structure);
	fsExtra.__set__("fs", fs);
	loadPartials.__set__("fs", fs);
	loadPartials.__set__("fsExtra", fsExtra);
	return fs;
}

describe("loadPartials", function() {
	describe("with partial", function() {
		it("should make the partial available to templates", function(done) {
			mockFs({
				"partials": {
					"_name.txt.hbs": "world"
				}
			});
			loadPartials("/partials").then(function() {
				var template = handlebars.compile("hello {{>name}}!");
				assert.equal(template(), "hello world!");
				done();
			}).done();
		});
	});
	describe("with non partial", function() {
		it("should not register the non partial", function(done) {
			mockFs({
				"partials": {
					"_nonpartial.txt": "world"
				}
			});
			loadPartials("/partials").then(function() {
				var template = handlebars.compile("hello {{>nonpartial}}!");
				try {
					template();
				} catch(e) {
					console.log(e.message);
					assert.ok(e.message.indexOf("nonpartial") !== -1);
					done();
				}
			}).done();
		});
	});
});
