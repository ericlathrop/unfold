"use strict";

var q = require("q");
var fs = require("fs");

module.exports = function(filename) {
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
};
