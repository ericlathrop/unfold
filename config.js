"use strict";

var q = require("q");
var fs = require("fs");
var merge = require("merge");

function load(filename) {
	var readFile = q.denodeify(fs.readFile.bind(fs));

	return readFile(filename).then(function(data) {
		var config = JSON.parse(data);
		if (!config.sourceDirectory) {
			throw new Error("config error in " + filename + ": sourceDirectory is required");
		}
		if (!config.destinationDirectory) {
			throw new Error("config error in " + filename + ": destinationDirectory is required");
		}
		return config;
	});
}

function forSourceFile(filename, config) {
	var data = merge(true, config.data);
	if (config.pages && config.pages[filename]) {
		data = merge(data, config.pages[filename]);
	}
	return data;
}

module.exports = {
	load: load,
	forSourceFile: forSourceFile
};
