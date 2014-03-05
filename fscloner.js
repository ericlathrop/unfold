var path = require("path");
var fs = require("fs");

function clone(srcDir, destDir, copyFunc) {
	fs.readdir(srcDir, function(err, files) {
		if (err) {
			throw err;
		}
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			var src = path.join(srcDir, file);
			var dest = path.join(destDir, file);
			cloneFile(src, dest, copyFunc, file);
		}
	});
}

function cloneFile(src, dest, copyFunc, file) {
	fs.stat(src, function(err, stat) {
		if (err) {
			throw err;
		}
		if (stat.isDirectory()) {
			clone(src, dest, copyFunc);
		} else {
			copyFunc(src, dest);
		}
	});
}

module.exports = {
	clone: clone
};
