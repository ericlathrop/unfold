"use strict";

var path = require("path");
var fs = require("fs");
var q = require("q");
var sass = require("node-sass");
var postcss = require("postcss");
var autoprefixer = require("autoprefixer");

function sassPromise(includeDir, data) {
	var deferred = q.defer();
	if (data.length === 0) {
		deferred.resolve("");
	} else {
		sass.render({
			file: "",
			data: data,
			includePaths: [includeDir],
			success: function(css) {
				deferred.resolve(css);
			},
			error: function(err) {
				deferred.reject(err);
			}
		}, function(err, result) {
			if (err) {
				deferred.reject(err);
				return;
			}
			deferred.resolve(result.css.toString());
		});
	}
	return deferred.promise;
}

module.exports = function(src, dest) {
	var readFile = q.denodeify(fs.readFile.bind(fs));
	var writeFile = q.denodeify(fs.writeFile.bind(fs));

	var ext = path.extname(src);
	dest = dest.substr(0, dest.length - ext.length) + ".css";

	var sassify = sassPromise.bind(undefined, path.dirname(src));
	return readFile(src, { encoding: "utf8" }).then(sassify).then(function(css) {
    return postcss([autoprefixer])
      .process(css, { from: src, to: dest });
  }).then(function(result) {
		return writeFile(dest, result.css, { encoding: "utf8" });
	});
};
