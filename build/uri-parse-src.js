


/*
* @version    0.1.6
* @date       2014-05-20
* @stability  2 - Unstable
* @author     Lauri Rooden <lauri@rooden.ee>
* @license    MIT License
*/



!function(URI) {
	var RESERVED = /[\]\[:\/?#@!$&()*+,;=']/g
	, SEPARATORS = {
		'':",", '+':",", '#':","     //, ';':";"
		, '?':"&"                    //, '&':"&", '/':"/", '.':"."
	}
	, escapeRe = /[.*+?^=!:${}()|\[\]\/\\]/g
	, expandRe = /\{([+#.\/;?&]?)((?:[\w%.]+(\*|:\d)?,?)+)\}/g
	//, parseRe  =  /\{([+#.\/;?&]?)((?:[\w%.]+(\*|:\d)?,?)+)\}|.[^{]*?/g
	, parseRe  =  new RegExp(expandRe.source + "|.[^{]*?", "g")

	function encodeNormal(val) {
		return encodeURIComponent(val).replace(RESERVED, escape)
	}
	function decodeNormal(val) {
		return decodeURIComponent(val)//.replace(RESERVED, escape)
	}

	function escapeRegExp(string) {
		return string.replace(escapeRe, "\\$&")
	}


	function addNamed(name, val, sep) {
		return name + (val || sep == "&" ? "=" : "") + val;
	}

	function mapCleanJoin(arr, mapFn, joinStr) {
		arr = arr.map(mapFn).filter(function(s){return typeof s == "string"})
		return arr.length && arr.join(joinStr)
	}

	/*** EXPAND
	function expand(template, data) {
		return template.replace(expandRe, function(_, op, vals) {
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
	//*/

	function Template(template) {
		var self = this
		//if (!(self instanceof Template)) return new Template(template)
	//** PARSE
		self.init(self.template = template)
	//*/
	/*** EXPAND
		self.expand = expand.bind(self, template)
	//*/
	}
	/*
	* sep = sep || '&';
	*  eq = eq  || '=';
	*/

	//** PARSE
	Template.prototype = {
		init: function(template) {
			var pos = 0
			, fnStr = ""
			, lengths = {}
			, reStr = "^"+ template.replace(parseRe, function(_, op, key) {
				if (!key) return escapeRegExp(_)

				var separator = SEPARATORS[op] || op
				, dec = op && separator == "," ? decodeURI : decodeNormal
				, add = (separator == ";" || separator == "&")
				, reGroup = "(.+?)"

				fnStr += 'sep="'+separator+'";'

				var reGroup = key.split(",").map(function(name) {
					var len, exp
					name = name.replace(/(?:(\*)|:(\d+))$/, function(_, _exp, _len) {
						len = _len
						exp = _exp
						return ""
					})

					var reGroup = "(.*?)"
					pos++
					//console.log("KEY", arguments)
					if (len) {
						reGroup = "((?:%..|.){1,"+len+"})"
						lengths[name] = {pos:pos, len: len}
					}
					else if (len = lengths[name]) {
						reGroup = "(\\"+len.pos+".*?)"
					}
					fnStr += "t=(parts["+pos+"]||'').split('"+ separator +"');"
					fnStr += "out[\""+name+"\"]=t.length>1?t.map(decodeURIComponent):decodeURIComponent(t[0]);"
					return add ?
						separator == "&" ?
						escapeRegExp(name + "=") + reGroup
						: escapeRegExp(name) + "(?:="+reGroup+")?"
						: reGroup
				}).join(escapeRegExp(separator))
				return (op!="+"?escapeRegExp(op):"")+reGroup

			}) + "$"

			this.re = new RegExp(reStr)
			this.fn = new Function("parts", "var t,sep,eq,out={};"+fnStr+";return out")
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

