var fs = require("fs");
var path = require("path");
var q = require("q");
var handlebars = require("handlebars");

module.exports = function(src, dest, context) {
	var readFile = q.denodeify(fs.readFile.bind(fs));
	var writeFile = q.denodeify(fs.writeFile.bind(fs));

	var ext = path.extname(src);
	dest = dest.substr(0, dest.length - ext.length);

	var loadLayout = q("{{> body}}");
	if (context && context.layout && context.layout.length > 0) {
		loadLayout = readFile(context.layout, {encoding: "utf8"});
	}

	return loadLayout.then(function(layoutData) {
		return readFile(src, {encoding: "utf8"}).then(function(bodyData) {
			handlebars.registerPartial("body", bodyData);

			var template = handlebars.compile(layoutData);
			// FIXME: unregisterPartial here?
			return writeFile(dest, template(context));
		});
	});
};
