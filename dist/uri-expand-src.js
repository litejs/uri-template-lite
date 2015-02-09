


/**
 * @version    0.1.11
 * @date       2015-02-09
 * @stability  2 - Unstable
 * @author     Lauri Rooden <lauri@rooden.ee>
 * @license    MIT License
 */



!function(URI) {

	/**
	 * URI Template
	 * @see http://tools.ietf.org/html/rfc6570
	 */

	var RESERVED = /[\]\[:\/?#@!$&()*+,;=']/g
	, SEPARATORS = {"": ",", "+": ",", "#": ",", "?": "&"}
	, escapeRe = /[.*+?^=!:${}()|\[\]\/\\]/g
	, expandRe = /\{([+#.\/;?&]?)((?:[\w%.]+(\*|:\d)?,?)+)\}/g
	, parseRe  =  new RegExp(expandRe.source + "|.[^{]*?", "g")

	//** EXPAND
	function encodeNormal(val) {
		return encodeURIComponent(val).replace(RESERVED, escape)
	}

	function addNamed(name, val, sep) {
		return name + (val || sep == "&" ? "=" : "") + val
	}

	function typeofString(s) {
		return typeof s == "string"
	}

	function mapCleanJoin(arr, mapFn, joinStr) {
		arr = arr.map(mapFn).filter(typeofString)
		return arr.length && arr.join(joinStr)
	}

	function expand(template, data) {
		return template.replace(expandRe, function(_, op, vals) {
			var sep = SEPARATORS[op] || op
			, enc = op && sep == "," ? encodeURI : encodeNormal
			, add = (sep == ";" || sep == "&") && addNamed
			, out = mapCleanJoin(vals.split(","), function(name) {
				var exp = name != (name = name.split("*")[0])
				, len = !exp && (len = name.split(":"), name = len[0], len[1])
				, val = data[name]

				if (val == null) return

				if (typeof val == "object") {
					if (Array.isArray(val)) {
						val = mapCleanJoin(val, enc, exp ? add ? sep + name + "=" : sep : "," )
					} else {
						val = mapCleanJoin(Object.keys(val), function(key) {
							return enc(key) + (exp ? "=" : ",") + enc(val[key])
						}, exp && (add || sep == "/") ? sep : ",")
						if (exp) add = null
					}
					if (!val) return
				} else {
					val = enc(len ? val.slice(0, len) : val)
				}

				return add ? add(name, val, sep) : val
			}, sep)

			return out || out === "" ? (op != "+" ? op + out : out) : ""
		}
	)}

	URI.expand = expand
	//*/

	function Template(template) {
		var self = this
		//if (!(self instanceof Template)) return new Template(template)
	/*** PARSE
		self.init(template)
	//*/
	//** EXPAND
		self.expand = expand.bind(self, template)
	//*/
	}
	/*
	* sep = sep || '&';
	*  eq = eq  || '=';
	*/

	/*** PARSE
	function escapeRegExp(string) {
		return string.replace(escapeRe, "\\$&")
	}

	Template.prototype = {
		init: function(template) {
			var pos = 0
			, fnStr = ""
			, lengths = {}
			, reStr = "^" + template.replace(parseRe, function(_, op, key) {
				if (!key) return escapeRegExp(_)

				var separator = SEPARATORS[op] || op
				//, dec = op && separator == "," ? decodeURI : decodeNormal
				, add = (separator == ";" || separator == "&")

				//fnStr += 'sep="'+separator+'";'

				var reGroup = key.split(",").map(function(name) {
					var re = "(.*?)"
					, exp = name != (name = name.split("*")[0])
					, len = !exp && (len = name.split(":"), name=len[0], len[1])

					pos++
					//console.log("KEY", arguments)
					if (len) {
						re = "((?:%..|.){1," + len + "})"
						lengths[name] = {pos: pos, len: len}
					}
					else if (len = lengths[name]) {
						re = "(\\" + len.pos + ".*?)"
					}
					//TODO: decodeURIComponent throws an Error on invalid input, add try-catch
					fnStr += "t=($["+pos+"]||'').split('"+ separator +"').map(decodeURIComponent);"
					fnStr += "o[\"" + name + "\"]=t.length>1?t:t[0];"
					return add ?
						separator == "&" ?
						escapeRegExp(name + "=") + re
						: escapeRegExp(name) + "(?:=" + re + ")?"
						: re
				}).join(escapeRegExp(separator))
				return (op != "+" ? escapeRegExp(op) : "") + reGroup

			}) + "$"

			this.template = template
			this.re = new RegExp(reStr)
			this.fn = new Function("$", "var t,o={};" + fnStr + "return o")
		},
		match: function(uri) {
			var match = this.re.exec(uri)
			return match && this.fn(match)
		}
	}
	//*/

	URI.Template = Template
// `this` is `exports` in NodeJS and `window` in browser.
}(this.URI || (this.URI = {}));

