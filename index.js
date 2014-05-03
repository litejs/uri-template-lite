


/*
* @version    0.1.4
* @date       2014-05-03
* @stability  2 - Unstable
* @author     Lauri Rooden <lauri@rooden.ee>
* @license    MIT License
*/



!function(URI) {
	var RESERVED = /[\]\[:\/?#@!$&()*+,;=']/g
	, RE =  /\{([+#.\/;?&]?)((?:[\w%.]+(\*|:\d)?,?)+)\}/g
	, SEPARATORS = {
		'':",", '+':",", '#':","     //, ';':";"
		, '?':"&"                    //, '&':"&", '/':"/", '.':"."
	}

	function encodeNormal(val) {
		return encodeURIComponent(val).replace(RESERVED, escape)
	}

	function addNamed(name, val, sep) {
		return name + (val || sep == "&" ? "=" : "") + val;
	}

	function mapCleanJoin(arr, mapFn, joinStr) {
		arr = arr.map(mapFn).filter(function(s){return typeof s == "string"})
		return arr.length && arr.join(joinStr)
	}

	function expand(template, data) {
		return template.replace(RE, function(_, op, vals) {
			var sep = SEPARATORS[op] || op
			, enc = op && sep == "," ? encodeURI : encodeNormal
			, add = (sep == ";" || sep == "&") && addNamed
			, out = mapCleanJoin(vals.split(","), function(name) {
				var exp = name != (name = name.split("*")[0])
				, len = !exp && (len = name.split(":"), name=len[0], len[1])
				, val = data[name]

				if (val == null) return

				if (typeof val == "object") {
					if (Array.isArray(val)) {
						val = mapCleanJoin(val, enc, exp ? add ? sep + name + "=" : sep : "," )
					}
					else {
						len = exp ? "=" : ","
						val = mapCleanJoin(Object.keys(val), function(key) {
							return enc(key) + len + enc(val[key])
						}, exp && (add || sep == "/") ? sep : "," )
						if (exp) add = null
					}
					if (!val) return
				}
				else {
					val = enc( len ? val.slice(0, len) : val )
				}

				return add ? add(name, val, sep) : val
			}, sep)

			return out ? (op!="+"?op+out:out) : out === "" && (op=="#"||op==".") ? op : ""
		}
	)}

	URI.expand = expand
// `this` is `exports` in NodeJS and `window` in browser.
}(this.URI || (this.URI = {}));

