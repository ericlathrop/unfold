"use strict";

var fs = require("fs");
var fsExtra = require("./fs_extra");
var merge = require("merge");
var path = require("path");
var q = require("q");

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
		if (config.dataDirectory) {
			return readDataDirectory(config.dataDirectory).then(function(externalData) {
				config.data = config.data || {};
				config.data = merge(config.data, externalData);
				return config;
			});
		}
		return config;
	});
}

function readDataDirectory(dataDirectory) {
	var readFile = q.denodeify(fs.readFile.bind(fs));

	var externalData = {};
	return fsExtra.traverse(dataDirectory, function(filename, stat) {
		if (stat.isDirectory()) {
			return;
		}
		return readFile(filename).then(function(contents) {
			var name = path.basename(filename, ".json");
			externalData[name] = JSON.parse(contents);
		});
	}).then(function() {
		return externalData;
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
