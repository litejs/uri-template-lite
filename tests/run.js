
var uri = require("../").expand

var test = require("testman")
.describe("URI Template");

function includeTests(file) {
	var json = require(process.env.PWD + "/tests/" + file)

	for(var level in json) {
		var arr = json[level].testcases, len = arr.length, i = 0
		, args = json[level].variables

		test = test.it("should pass "+level)
		for (;i<len;i++) {
			var res = uri(arr[i][0], args)
			if (Array.isArray(arr[i][1])) {
				test = test.ok(function(){
					return arr[i][1].indexOf(res) != -1
				})
			} else {
				test = test.equal(res, arr[i][1])
			}
		}
	}
}

includeTests("uritemplate-test/spec-examples.json")
includeTests("uritemplate-test/spec-examples-by-section.json")
includeTests("uritemplate-test/extended-tests.json")
//includeTests("uritemplate-test/negative-tests.json")



test.done()

