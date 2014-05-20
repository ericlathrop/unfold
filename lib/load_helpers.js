"use strict";

var fsExtra = require("./fs_extra");
var q = require("q");
var path = require("path");
var handlebars = require("handlebars");

function loadHelper(filename) {
	filename = path.resolve(filename);
	var name = path.basename(filename, ".js");
	try {
		var helper = require(filename);
		handlebars.registerHelper(name, helper);
	} catch(e) {
		var err = new Error("Error loading helper " + filename + ": " + e.message);
		err.innerError = e;
		throw err;
	}
}

module.exports = function(helpersDirectory) {
	return fsExtra.readDirFiles(helpersDirectory).then(function(files) {
		var promises = files.filter(function(file) {
			return /\.js$/.test(file);
		}).map(loadHelper);
		return q.all(promises);
	});
};
