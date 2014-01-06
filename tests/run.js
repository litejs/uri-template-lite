

require("browser-upgrade-lite")

var uri = require("../").expand

var test = require("testman")
.describe("URI Template");

function includeTests(json) {

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

includeTests(require("./uritemplate-test/spec-examples.json"))
includeTests(require("./uritemplate-test/spec-examples-by-section.json"))
includeTests(require("./uritemplate-test/extended-tests.json"))
//includeTests("uritemplate-test/negative-tests.json")



test.done()

