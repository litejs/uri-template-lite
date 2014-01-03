/*
* http://tools.ietf.org/html/rfc6570
*/


!function(root) {
	var RESERVED = /[\]\[:\/?#@!$&()*+,;=']/g
	, re =  /\{([+#.\/;?&]?)((?:[\w%.]+(\*|:\d)?,?)+)\}/g
	, Joiners = {
		'':",", '+':",", '#':","
		//, ';':";"
		, '?':"&"
		//, '&':"&", '/':"/", '.':"."
	}
	, Fns = {
		";": addLabeled, "&": addLabeled
	}

	function encodeNormal(val) {
		return encodeURIComponent(val).replace(RESERVED, escape );
	}


	function addLabeled(name, val, joiner) {
		return name + (val || joiner == "&" ? "=" : "") + val;
	}




	function mapCleanJoin(arr, map, join) {
		return arr.map(map).filter(Boolean).join(join)
	}

		function work(data, _, op, vals) {
			var joiner = Joiners[op] || op
			, enc = op && joiner == "," ? encodeURI : encodeNormal
			, fn = Fns[joiner]
			, out = mapCleanJoin(vals.split(","), function(name){
				var exp = name != (name = name.split("*")[0])
				, len = !exp && (len = name.split(":"), name=len[0], len[1])
				, val = data[name]

				if (!(name in data)) return

				if (Array.isArray(val)) {
					if (val.length == 0) return
					val=mapCleanJoin(val, enc, 
						exp ? joiner + ((joiner == ";" || joiner == "&") ? name + "=" : "") : "," )
					/*
					.map(enc)
					.filter(function(n){return n})
					.join(
						exp ? joiner + ((joiner == ";" || joiner == "&") ? name + "=" : "") : ","
					)
					*/
				}
				else if (typeof val == "object") {
					var list_joiner = exp ? "=" : ","
					val = mapCleanJoin(Object.keys(val), function(key){
						return key in val && enc(key) + list_joiner + enc(val[key])
					}, exp && (joiner == "/" || joiner == ";" || joiner == "&") ? joiner : "," )
					if (val.length == 0) return
					if (exp) fn = null
				}
				else {
					val = enc( len ? val.slice(0, len) : val )
				}

				return fn ? fn(name, val, joiner) : val
			}, joiner)


			return (op!="+"&&out?op:"") + out
				
		}

	function expand(template, data) {


		return template.replace(re, work.bind(null, data))
	}

	root.expand = expand
}(this);

