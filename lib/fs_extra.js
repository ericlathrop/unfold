"use strict";

var path = require("path");
var fs = require("fs");
var q = require("q");

function clone(src, dest, copyFunc) {
	var stat = q.denodeify(fs.stat.bind(fs));
	var mkdir = q.denodeify(fs.mkdir.bind(fs));

	src = path.normalize(src);
	dest = path.normalize(dest);
	var srcParts = src.split(path.sep);
	var destParts = dest.split(path.sep);

	return readDirRecursive(src, function(file, fileStat) {
		var d = destParts.concat(file.split(path.sep).slice(srcParts.length)).join(path.sep);
		if (fileStat.isDirectory()) {
			return stat(d).fail(function() {
				return mkdir(d);
			});
		} else {
			return copyFunc(file, d);
		}
	}).all().then(function(contents) {
		return contents.filter(function(e) { return e !== undefined; });
	});
}

function copy(src, dest) {
	var deferred = q.defer();

	var read = fs.createReadStream(src);
	read.on("error", function(err) {
		deferred.reject(err);
	});

	var write = fs.createWriteStream(dest);
	write.on("error", function(err) {
		deferred.reject(err);
	});
	write.on("finish", function() {
		deferred.resolve(true);
	});
	read.pipe(write);

	return deferred.promise;
}

function readDirRecursive(file, callback) {
	var stat = q.denodeify(fs.stat.bind(fs));
	var readdir = q.denodeify(fs.readdir.bind(fs));

	return stat(file).then(function(fileStat) {
		if (fileStat.isDirectory()) {
			var val = callback(file, fileStat);
			return q(val).then(function(dirVal) {

				return readdir(file).then(function(files) {
					function combinedDir(f) {
						return path.join(file, f);
					}
					var contentsPromises = files.map(combinedDir).map(function(f) {
						return readDirRecursive(f, callback);
					});
					return q.all(contentsPromises);
				}).then(function(contents) {
					var merged = [dirVal];
					return merged.concat.apply(merged, contents);
				});
			});
		} else {
			var fileVal = callback(file, fileStat);
			return [fileVal];
		}
	});
}

function readDirFiles(file) {
	return readDirRecursive(file, function(file, fileStat) {
		if (!fileStat.isDirectory()) {
			return file;
		}
	}).then(function(paths) {
		return paths.filter(function(e) { return e !== undefined; });
	});
}

module.exports = {
	clone: clone,
	copy: copy,
	readDirRecursive: readDirRecursive,
	readDirFiles: readDirFiles
};
