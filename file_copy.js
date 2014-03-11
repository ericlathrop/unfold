var fs = require("fs");
var q = require("q");

module.exports = function(src, dest) {
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
};
