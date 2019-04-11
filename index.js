


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

	var RESERVED = /[!'()]/g
	// /[[\]:\/!#$&()*+,;='?@]/g
	, SEPARATORS = {"": ",", "+": ",", "#": ",", "?": "&"}
	, escapeRe = /[$-\/?[-^{|}]/g
	, expandRe = /\{([#&+.\/;?]?)((?:[\w%.]+(\*|:\d+)?,?)+)\}/g
	, parseRe  = RegExp(expandRe.source + "|.[^{]*?", "g")

	/*** EXPAND ***/
	function encodeNormal(val) {
		return encodeURIComponent(val).replace(RESERVED, escape)
	}

	function notNull(s) {
		return s != null
	}

	function mapCleanJoin(arr, mapFn, joinStr) {
		arr = arr.map(mapFn).filter(notNull)
		return arr.length && arr.join(joinStr)
	}

	function expand(template, data) {
		return template.replace(expandRe, function(_, op, vals) {
			var sep = SEPARATORS[op] || op
			, named = sep == ";" || sep == "&"
			, enc = op && sep == "," ? encodeURI : encodeNormal
			, out = mapCleanJoin(vals.split(","), function(_name) {
				var mod = _name.split(/[*:]/)
				, name = mod[0]
				, val = data[name]

				if (val == null) return

				if (typeof val == "object") {
					mod = name != _name
					if (Array.isArray(val)) {
						val = mapCleanJoin(val, enc, mod ? named ? sep + name + "=" : sep : "," )
					} else {
						val = mapCleanJoin(Object.keys(val), function(key) {
							return enc(key) + (mod ? "=" : ",") + enc(val[key])
						}, mod && (named || sep == "/") ? sep : ",")
						if (mod) named = 0
					}
					if (!val) return
				} else {
					val = enc(mod[1] ? val.slice(0, mod[1]) : val)
				}

				return (
					named ?
					name + (val || sep == "&" ? "=" + val : val) :
					val
				)
			}, sep)

			return out || out === "" ? (op != "+" ? op + out : out) : ""
		}
	)}

	URI.expand = expand
	/**/

	URI.Template = function Template(template) {
		var self = this
		self.template = template
		//if (!(self instanceof Template)) return new Template(template)
		/*** PARSE ***/
		, pos = 0
		, lengths = {}
		, fnStr = ""
		, reStr = "^" + template.replace(parseRe, function(_, op, vals) {
			if (!vals) return escapeRegExp(_)

			var sep = SEPARATORS[op] || op
			, named = sep == ";" || sep == "&"
			, reGroup = vals.split(",").map(function(_name) {
				var mod = _name.split(/[*:]/)
				, name = mod[0]
				, re = (lengths[name] || "(") + ".*?)"

				pos++
				//console.log("KEY", arguments)
				if (mod[1]) {
					re = "((?:%..|.){1," + mod[1] + "})"
					lengths[name] = "(\\" + pos
				}
				//TODO: decodeURIComponent throws an Error on invalid input, add try-catch
				fnStr += "t=($[" + pos + "]||'').split('" + sep + "').map(decodeURIComponent);"
				fnStr += "o[\"" + name + "\"]=t.length>1?t:t[0];"
				return (
					named ?
					escapeRegExp(name) + "(?:=" + re + ")?" :
					sep == "&" ?
					escapeRegExp(name + "=") + re :
					re
				)
			}).join(escapeRegExp(sep))
			return (op != "+" ? escapeRegExp(op) + reGroup : reGroup)

		}) + "$"
		, re = RegExp(reStr)
		, fn = Function("$", "var t,o={};" + fnStr + "return o")
		self.match = function(uri) {
			var match = re.exec(uri)
			return match && fn(match)
		}

		function escapeRegExp(string) {
			return string.replace(escapeRe, "\\$&")
		}
		/**/
		/*** EXPAND ***/
		self.expand = expand.bind(self, template)
		/**/
	}

// `this` is `exports` in NodeJS and `window` in browser.
}(this.URI || (this.URI = {}));

