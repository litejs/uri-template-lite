


/*
* @version  0.0.2
* @author   Lauri Rooden - https://github.com/litejs/uri-template-lite
* @license  MIT License  - http://lauri.rooden.ee/mit-license.txt
*/



!function(root) {
	var RESERVED = /[\]\[:\/?#@!$&()*+,;=']/g
	, re =  /\{([+#.\/;?&]?)((?:[\w%.]+(\*|:\d)?,?)+)\}/g
	, JOINERS = {
		'':",", '+':",", '#':","     //, ';':";"
		, '?':"&"                    //, '&':"&", '/':"/", '.':"."
	}

	function encodeNormal(val) {
		return encodeURIComponent(val).replace(RESERVED, escape );
	}

	function addLabeled(name, val, joiner) {
		return name + (val || joiner == "&" ? "=" : "") + val;
	}

	function isString(s){
		return typeof s == "string"
	}

	function mapCleanJoin(arr, mapFn, joinStr) {
		arr = arr.map(mapFn).filter(isString)
		return arr.length && arr.join(joinStr)
	}

	function work(data, _, op, vals) {
		var joiner = JOINERS[op] || op
		, enc = op && joiner == "," ? encodeURI : encodeNormal
		, fn = (joiner == ";" || joiner == "&") && addLabeled
		, out = mapCleanJoin(vals.split(","), function(name){
			var exp = name != (name = name.split("*")[0])
			, len = !exp && (len = name.split(":"), name=len[0], len[1])
			, val = data[name]

			if (val == null) return

			if (typeof val == "object") {
				if (Array.isArray(val)) {
					val=mapCleanJoin(val, enc, 
						exp ? joiner + ((joiner == ";" || joiner == "&") ? name + "=" : "") : "," )
				}
				else {
					var list_joiner = exp ? "=" : ","
					val = mapCleanJoin(Object.keys(val), function(key){
						return key in val && enc(key) + list_joiner + enc(val[key])
					}, exp && (joiner == "/" || joiner == ";" || joiner == "&") ? joiner : "," )
					if (exp) fn = null
				}
				if (!val) return
			}
			else {
				val = enc( len ? val.slice(0, len) : val )
			}

			return fn ? fn(name, val, joiner) : val
		}, joiner)


		//return (op!="+"&&out||((op == "#" || op == ".") && out == "")?op:"") + (out||"")
		return out ? (op!="+"?op+out:out) : out === "" && (op=="#"||op==".") ? op : ""
	}

	function expand(template, data) {
		return template.replace(re, work.bind(null, data))
	}

	root.expand = expand
}(this);

