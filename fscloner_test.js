var rewire = require("rewire");
var fscloner = rewire("./fscloner");

var FS = require("fs-mock");

describe("fscloner", function() {
	describe("clone", function() {
		describe("with nonexistant source folder", function() {
			it("should explode", function() {
				var fs = new FS({});
				fscloner.__set__("fs", fs);
				try {
					fscloner.clone("src", "dest", function(src, dest) {});
					throw new Error("should throw an exception");
				} catch(err) {
				}
			});
		});
	});
});
