#!/usr/bin/env node
"use strict";

var path = require("path");
var q = require("q");
var config = require("../lib/config");
var fsExtra = require("../lib/fs_extra");
var loadPartials = require("../lib/load_partials");
var transformHandlebars = require("../lib/transform_handlebars");
var transformSass = require("../lib/transform_sass");

function main(argv) {
	var args = argv.slice(2);

	for (var i = 0; i < args.length; i++) {
		processSite(args[i]);
	}
}

function processSite(file) {
	config.load(file).then(function(cfg) {
		if (cfg.partialsDirectory) {
			loadPartials(cfg.partialsDirectory);
		}
		return fsExtra.clone(cfg.sourceDirectory, cfg.destinationDirectory, processFile.bind(undefined, cfg));
	}).done();
}

function processFile(cfg, src, dest) {
	cfg = config.forSourceFile(src, cfg);
	if (endsWith(src, ".hbs")) {
		return transformHandlebars(src, dest, cfg);
	}
	if (endsWith(src, ".scss") || endsWith(src, ".sass")) {
		if (path.basename(src)[0] === "_") {
			return q();
		}
		return transformSass(src, dest);
	}
	return fsExtra.copy(src, dest);
}

function endsWith(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

main(process.argv);
