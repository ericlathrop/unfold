var fs = require("fs");
var path = require("path");
var q = require("q");
var handlebars = require("handlebars");

module.exports = function(src, dest, context) {
	var readFile = q.denodeify(fs.readFile.bind(fs));
	var writeFile = q.denodeify(fs.writeFile.bind(fs));

	var ext = path.extname(src);
	dest = dest.substr(0, dest.length - ext.length);

	return readFile(src, {encoding: "utf8"}).then(function(data) {
		var template = handlebars.compile(data);
		return writeFile(dest, template(context));
	});
};
