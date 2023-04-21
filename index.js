/* global escape */


/*! litejs.com/MIT-LICENSE.txt */


!function() {
	"use strict";

	module.exports = Template
	module.exports.expand = expand

	/**
	 * URI Template
	 * @see http://tools.ietf.org/html/rfc6570
	 */

	var RESERVED = /[!'()]/g
	// /[[\]:\/!#$&()*+,;='?@]/g
	, SEPARATORS = {"": ",", "+": ",", "#": ",", "?": "&"}
	, escapeRe = /[$-/?[-^{|}]/g
	, expandRe = /\{([#&+./;?]?)((?:[-\w%.]+(\*|:\d+)?(?:,|(?=})))+)\}/g
	, parseRe  = RegExp(expandRe.source + "|.[^{]*?", "g")


	function encodeNormal(val) {
		return encodeURIComponent(val).replace(RESERVED, escape)
	}
	function catchDecode(str) {
		try {
			return decodeURIComponent(str)
		} catch(e) {
			return str
		}
	}

	function notNull(s) {
		return s != null
	}

	function mapCleanJoin(arr, mapFn, joinStr) {
		arr = arr.map(mapFn).filter(notNull)
		return arr.length && arr.join(joinStr)
	}

	function expand(template, data, opts) {
		return template.replace(expandRe, function(_, op, vals) {
			var sep = SEPARATORS[op] || op
			, named = sep == ";" || sep == "&"
			, enc = op && sep == "," ? encodeURI : opts && opts.encoder || encodeNormal
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


	function Template(template, opts_) {
		var self = this
		//if (!(self instanceof Template)) return new Template(template)
		, opts = Object.assign({
			decoder: catchDecode
		}, opts_)
		, pos = 0
		, lengths = {}
		, fnStr = ""
		, reStr = "^" + template.replace(parseRe, function(_, op, vals) {
			if (!vals) return escapeRegExp(_)

			var sep = SEPARATORS[op] || op
			, named = sep == ";" || sep == "&"
			return vals.split(",").map(function(_name, i) {
				var mod = _name.split(/[*:]/)
				, name = mod[0]
				, re = (lengths[name] || "(") + ".*?)"

				pos++
				if (mod[1]) {
					re = "((?:%..|.){1," + mod[1] + "})"
					lengths[name] = "(\\" + pos
				}
				fnStr += "t=($[" + pos + "]||'').split('" + (mod[1] ? named ? sep + name + "=" : sep : ",") + "').map(d);"
				fnStr += "o[\"" + name + "\"]=" + (mod[1] === "" ? "t;" : "t.length>1?t:t[0];")
				re = escapeRegExp(i === 0 ? op === "+" ? "" : op : sep) + (
					named ?
					escapeRegExp(name) + "(?:=" + re + ")?" :
					//sep == "&" ?
					//escapeRegExp(name + "=") + re :
					re
				)
				return mod[1] === "" ? "(?:" + re + ")?" : re
			}).join("")
		}) + "$"
		, re = RegExp(reStr)
		, fn = Function("$,d", "var t,o={};" + fnStr + "return o")

		self.template = template
		self.match = function(uri) {
			var match = re.exec(uri)
			return match && fn(match, opts.decoder)
		}

		function escapeRegExp(string) {
			return string.replace(escapeRe, "\\$&")
		}
		self.expand = function(data) {
			return expand(template, data, opts)
		}
	}

// `this` is `exports` in NodeJS and `window` in browser.
}(); // jshint ignore:line

