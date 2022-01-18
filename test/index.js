
// git submodule init
// git submodule update
// npm i -g @litejs/cli

var URI = require("../").URI

describe("URI Template")
.test("multiple templates #2", function(assert) {
	const UriTemplate = URI.Template
	const a = new UriTemplate('img-{entryNo}')
	const b = new UriTemplate('ref-{entryNo}')

	assert.equal(a.template, 'img-{entryNo}')
	assert.equal(b.template, 'ref-{entryNo}')

	assert.equal(a.match('img-1234'), { entryNo: '1234' })
	assert.equal(b.match('img-1234'), null)

	assert.equal(a.match('ref-1234'), null)
	assert.equal(b.match('ref-1234'), { entryNo: '1234' })

	assert.end()
})


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
	for (var level in json) !function(level) {
		it("should expand " + level, function(assert) {
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
	}(level)
}

function includeMatchTests(json) {
	for(var level in json) !function(level) {
		it("should parse " + level, function(assert) {
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
					assert.type(res, "object")
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
	}(level)
}

