var path = require("path");
var fs = require("fs");

function clone(src, dest, copyFunc) {
	fs.stat(src, function(err, stat) {
		if (err) {
			throw err;
		}
		if (stat.isDirectory()) {
			fs.exists(dest, function(exists) {
				if (exists) {
					cloneDir(src, dest, copyFunc);
				} else {
					fs.mkdir(dest, function(err) {
						if (err) {
							throw err;
						}
						cloneDir(src, dest, copyFunc);
					});
				}
			});
		} else {
			copyFunc(src, dest);
		}
	});
}

function cloneDir(srcDir, destDir, copyFunc) {
	fs.readdir(srcDir, function(err, files) {
		if (err) {
			throw err;
		}
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			var src = path.join(srcDir, file);
			var dest = path.join(destDir, file);
			clone(src, dest, copyFunc);
		}
	});
}

module.exports = {
	clone: clone
};
