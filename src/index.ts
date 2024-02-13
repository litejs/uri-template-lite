/* global escape */


/*! litejs.com/MIT-LICENSE.txt */

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

	function encodeNormal(val: string) {
		return encodeURIComponent(val).replace(RESERVED, escape)
	}

	function escapeFn(str) {
		return str.replace(escapeRe, "\\$&")
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

	function expand(template: string, data: Record<string, unknown>, opts?: IOptionsExpand) {
		return template.replace(expandRe, function(_, op, vals) {
			var sep = SEPARATORS[op] || op
			, named = sep == ";" || sep == "&"
			, enc = op && sep == "," ? encodeURI : opts && opts.encoder || encodeNormal
			, out = mapCleanJoin(vals.split(","), function(_name) {
				var mod = _name.split(/[*:]/)
				, name = mod[0]
				, val: string = data[name] as any

				if (val == null) return

				if (typeof val == "object") {
					mod = name != _name
					if (Array.isArray(val)) {
						val = mapCleanJoin(val, enc, mod ? named ? sep + name + "=" : sep : "," )
					} else {
						val = mapCleanJoin(Object.keys(val), function(key) {
							return enc(key) + (mod ? "=" : ",") + enc(val[key])
						}, mod && (named || sep == "/") ? sep : ",")
						// @ts-ignore
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

interface Template
{
	(template: string, opts_?: IOptions): {
		template: string
		match(uri: string): Record<string, unknown>
		expand(data: Record<string, unknown>): string
	}

	new (template: string, opts_?: IOptions): {
		template: string
		match(uri: string): Record<string, unknown>
		expand(data: Record<string, unknown>): string
	}
}

	function Template(template: string, opts_?: IOptions) {
		// @ts-ignore
		var self = this
		//if (!(self instanceof Template)) return new Template(template)
			// @ts-ignore
		, opts = Object.assign({
			decoder: catchDecode
		}, opts_)
		, pos = 0
		, lengths = {}
		, fnStr = ""
		, reStr = "^" + template.replace(parseRe, function(_, op, vals) {
			if (!vals) return escapeFn(_)

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
				re = escapeFn(i === 0 ? op === "+" ? "" : op : sep) + (
					named ?
					escapeFn(name) + "(?:=" + re + ")?" :
					//sep == "&" ?
					//escapeFn(name + "=") + re :
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

		self.expand = function(data) {
			return expand(template, data, opts)
		}
	}

export { Template }
export { expand }
export default Template

export interface IOptionsExpand
{
	encoder?(val: string): string
}

export interface IOptions extends IOptionsExpand
{
	decoder?(str: string): string
}

// @ts-ignore
if (process.env.TSDX_FORMAT !== 'esm')
{
	Object.defineProperty(Template, "__esModule", { value: true });

	Object.defineProperty(Template, 'Template', { value: Template });
	Object.defineProperty(Template, 'default', { value: Template });

	Object.defineProperty(Template, 'expand', { value: expand });

}

// `this` is `exports` in NodeJS and `window` in browser.
 // jshint ignore:line

