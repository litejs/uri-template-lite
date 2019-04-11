

var URI = require("../").URI

var test = require("testman")

test.describe.it.hasVals = function(a, b, options) {
	var ok = a && true
	ok && Object.keys(a).forEach(function(key){
		if (
		key in b &&
		a[key] != b[key] &&
		""+a[key] != ""+b[key] &&
		(typeof a[key] == "string" && b[key] && (""+b[key]).slice(0, a[key].length) != a[key])
		) ok = false
		ok || console.log("test", key, ok)
	})
	ok || console.log("\n\nCompare:\n" + JSON.stringify(a) + "\n" + JSON.stringify(b))
	return this.ok(ok, options || "Expected: "+b+" Got: "+a )
}


test = test.describe("URI Template");

includeExpandTests(require("./uritemplate-test/spec-examples.json"))
includeMatchTests(require("./uritemplate-test/spec-examples.json"))

includeExpandTests(require("./uritemplate-test/spec-examples-by-section.json"))
//includeMatchTests(require("./uritemplate-test/spec-examples-by-section.json"))

includeExpandTests(require("./uritemplate-test/extended-tests.json"))
//includeMatchTests(require("./uritemplate-test/extended-tests.json"))

//includeExpandTests(require("./uritemplate-test/negative-tests.json"))
//includeMatchTests("uritemplate-test/negative-tests.json")

includeExpandTests(require("./custom-examples.json"))
includeMatchTests(require("./custom-examples.json"))


test.done()

function includeExpandTests(json) {
	for (var level in json) {
		var res
		, arr = json[level].testcases, len = arr.length, i = 0
		, args = json[level].variables

		test = test.it("should pass " + level)
		for (; i < len; i++) {
			res = URI.expand(arr[i][0], args)
			if (Array.isArray(arr[i][1])) {
				test = test.ok(function(){
					return arr[i][1].indexOf(res) != -1
				})
			} else if (arr[i][1] === false) {
				// negative test
				test = test.equal(res, arr[i][0])
			} else {
				test = test.equal(res, arr[i][1])
			}
		}
	}
}

function includeMatchTests(json) {

	for(var level in json) {
		var arr = json[level].testcases, len = arr.length, i = 0
		, args = json[level].variables

		test = test.it("should pass "+level)
		for (;i<len;i++) {
			if (Array.isArray(arr[i][1])) {
				//test = test.ok(function(){
				//	return arr[i][1].indexOf(res) != -1
				//})
			} else {
				var uri = new URI.Template(arr[i][0])
				res = uri.match(arr[i][1])
				var msg = "# re: " + uri.re + " (" + arr[i][0] + ") : " + arr[i][1] + " ->\n" +
					JSON.stringify(res) + "\n" +
					JSON.stringify(args)

				//console.log(msg, uri.keys)
				test = test.type(res, "object", msg)
				test.hasVals(res, args, msg)
			}
		}
	}
}

