"use strict";

var rewire = require("rewire");
var config = rewire("./config");
var assert = require("assert");
var FS = require("fs-mock");

function mockFs(structure) {
	var fs = new FS(structure);
	config.__set__("fs", fs);
	return fs;
}

describe("config", function() {
	describe("with nonexistant file", function() {
		it("should return a failing promise", function(done) {
			mockFs({});
			config("/config.json").fail(function() {
				done();
			});
		});
	});
	describe("with an existing JSON file", function() {
		it("should return a parsed object", function(done) {
			mockFs({
				"config.json": "{\"sourceDirectory\": \"/src\", \"destinationDirectory\": \"/dest\"}"
			});
			config("/config.json").done(function(cfg) {
				assert.ok(cfg);
				done();
			});
		});
		describe("when the file is not JSON", function() {
			it("should return a failing promise", function(done) {
				mockFs({
					"config.json": "derp"
				});
				config("/config.json").fail(function() {
					done();
				});
			});
		});
		describe("when missing the sourceDirectory property", function() {
			it("should return a failing promise", function(done) {
				mockFs({
					"config.json": "{\"destinationDirectory\": \"/src\"}"
				});
				config("/config.json").fail(function(reason) {
					assert.notEqual(-1, reason.message.indexOf("sourceDirectory"));
					done();
				});
			});
		});
		describe("when missing the destinationDirectory property", function() {
			it("should return a failing promise", function(done) {
				mockFs({
					"config.json": "{\"sourceDirectory\": \"/src\"}"
				});
				config("/config.json").fail(function(reason) {
					assert.notEqual(-1, reason.message.indexOf("destinationDirectory"));
					done();
				});
			});
		});
	});
});
