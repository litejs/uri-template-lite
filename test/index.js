
// git submodule init
// git submodule update
// npm i -g litejs

var URI = require("../").URI
, testCase = require("litejs/test")
.describe("URI Template")


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



function includeExpandTests(json) {
	for (var level in json) {
		testCase.test("it should pass " + level, function(assert) {
			var res
			, arr = json[level].testcases, len = arr.length, i = 0
			, args = json[level].variables
			for (; i < len; i++) {
				res = URI.expand(arr[i][0], args)
				if (Array.isArray(arr[i][1])) {
					assert.notEqual(arr[i][1].indexOf(res), -1)
				} else if (arr[i][1] === false) {
					// negative test
					assert.equal(res, arr[i][0])
				} else {
					assert.equal(res, arr[i][1])
				}
			}
			assert.end()
		})
	}
}

function includeMatchTests(json) {
	for(var level in json) {
		testCase.test("it should pass " + level, function(assert) {
			var arr = json[level].testcases, len = arr.length, i = 0
			, args = json[level].variables

			for (; i<len; i++) {
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
					assert.type(res, "object", msg)
					hasVals(res, args, msg)
				}
			}
			assert.end()
			function hasVals(a, b, options) {
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
				return assert.ok(ok, options || "Expected: "+b+" Got: "+a )
			}
		})
	}
}

