"use strict";

var loadHelpers = require("./load_helpers");
var handlebars = require("handlebars");
var assert = require("assert");

describe("loadHelpers", function() {
	describe("with helper", function() {
		it("should make the partial available to templates", function(done) {
			loadHelpers("test_data/helpers").then(function() {
				var template = handlebars.compile("hello {{helper}}!");
				assert.equal(template(), "hello world!");
				done();
			}).done();
		});
	});
	describe("with non-js file", function() {
		it("should not explode", function(done) {
			loadHelpers("test_data/nothelpers").then(function() {
				var template = handlebars.compile("hello world!");
				assert.equal(template(), "hello world!");
				done();
			}).done();
		});
	});
	describe("with invalid js file", function() {
		it("should throw a nice error", function(done) {
			loadHelpers("test_data/invalidhelpers").fail(function(err) {
				assert.ok(err.message.indexOf("test_data/invalidhelpers/invalidhelper.js") !== -1);
				done();
			}).done();
		});
	});
});
