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

	return traverse(src, function(file, fileStat) {
		var d = destParts.concat(file.split(path.sep).slice(srcParts.length)).join(path.sep);
		if (fileStat.isDirectory()) {
			return stat(d).fail(function() {
				return mkdir(d);
			});
		} else {
			return copyFunc(file, d);
		}
	});
}

function traverse(file, visitFunc) {
	var stat = q.denodeify(fs.stat.bind(fs));

	return stat(file).then(function(fileStat) {
		var p = q(visitFunc(file, fileStat));

		if (fileStat.isDirectory()) {
			return p.then(function() {
				return traverseDir(file, visitFunc);
			});
		}
		return p;
	});
}

function traverseDir(dir, visitFunc) {
	var readdir = q.denodeify(fs.readdir.bind(fs));

	return readdir(dir).then(function(files) {
		var promises = [];
		for (var i = 0; i < files.length; i++) {
			var file = path.join(dir, files[i]);
			promises.push(traverse(file, visitFunc));
		}
		return q.all(promises);
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

module.exports = {
	clone: clone,
	traverse: traverse,
	copy: copy
};
