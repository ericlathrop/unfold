"use strict";

var fs = require("fs");
var fsExtra = require("./fs_extra");
var path = require("path");
var q = require("q");
var handlebars = require("handlebars");

function partialName(filename) {
	var name = path.basename(filename);
	return name.substr(1, name.indexOf(".") - 1);
}

function loadPartial(filename) {
	var readFile = q.denodeify(fs.readFile.bind(fs));

	return readFile(filename, {encoding: "utf8"}).then(function(bodyData) {
		var n = partialName(filename);
		handlebars.registerPartial(n, bodyData);
	});
}

module.exports = function(partialsDirectory) {
	return fsExtra.readDirFiles(partialsDirectory).then(function(files) {
		var promises = files.filter(function(file) {
			return /^_.*\.hbs$/.test(path.basename(file));
		}).map(loadPartial);
		return q.all(promises);
	});
};
