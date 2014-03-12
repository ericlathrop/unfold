var rewire = require("rewire");
var transformHandlebars = rewire("./transform_handlebars");
var assert = require("assert");
var FS = require("fs-mock");

function mockFs(structure) {
	var fs = new FS(structure);
	transformHandlebars.__set__("fs", fs);
	return fs;
}

describe("transformHandlebars", function() {
	describe("with plain text file", function() {
		it("should create an empty file in the destination", function(done) {
			var fs = mockFs({
				"src.txt.hbs": "hello world"
			});
			transformHandlebars("/src.txt.hbs", "/dest.txt.hbs").done(function() {
				var data = fs.readFileSync("/dest.txt");
				assert.equal("hello world", data);
				done();
			});
		});
	});
	describe("with a simple template and data", function() {
		it("should execute the template", function(done) {
			var fs = mockFs({
				"src.txt.hbs": "hello {{name}}!"
			});
			var context = {"name": "eric"};
			transformHandlebars("/src.txt.hbs", "/dest.txt.hbs", context).done(function() {
				var data = fs.readFileSync("/dest.txt");
				assert.equal("hello eric!", data);
				done();
			});
		});
	});
});
