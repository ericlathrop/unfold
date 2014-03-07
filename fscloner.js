var path = require("path");
var fs = require("fs");
var q = require("q");

function clone(src, dest, copyFunc) {
	var stat = q.denodeify(fs.stat.bind(fs));
	var mkdir = q.denodeify(fs.mkdir.bind(fs));

	return stat(src).then(function(srcStat) {
		if (srcStat.isDirectory()) {
			return stat(dest).fail(function() {
				return mkdir(dest);
			}).then(function() {
				cloneDir(src, dest, copyFunc);
			});
		} else {
			return copyFunc(src, dest);
		}
	});
}

function cloneDir(srcDir, destDir, copyFunc) {
	var readdir = q.denodeify(fs.readdir.bind(fs));

	return readdir(srcDir).then(function(files) {
		var copyPromises = [];
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			var src = path.join(srcDir, file);
			var dest = path.join(destDir, file);
			copyPromises.push(clone(src, dest, copyFunc));
		}
		return q.all(copyPromises);
	});
}

module.exports = {
	clone: clone
};
