#!/usr/bin/env node

var config = require("./config");
var fsExtra = require("./fs_extra");
var transformHandlebars = require("./transform_handlebars");

function main(argv) {
	var args = argv.slice(2);

	for (var i = 0; i < args.length; i++) {
		processSite(args[i]);
	}
}

function processSite(file) {
	config.load(file).then(function(cfg) {
		return fsExtra.clone(cfg.sourceDirectory, cfg.destinationDirectory, processFile.bind(undefined, cfg));
	}).done();
}

function processFile(cfg, src, dest) {
	var cfg = config.forSourceFile(src, cfg);
	if (endsWith(src, ".hbs")) {
		return transformHandlebars(src, dest, cfg);
	}
	return fsExtra.copy(src, dest);
}

function endsWith(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

main(process.argv);
