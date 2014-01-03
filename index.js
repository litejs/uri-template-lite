/*
* http://tools.ietf.org/html/rfc6570
*/


!function(root) {
	var RESERVEDCHARS_RE = /[\]\[:\/?#@!$&()*+,;=']/g
	//var RESERVEDCHARS_RE = new RegExp("[:/?#\\[\\]@!$&()*+,;=']","g");

	function encodeNormal(val) {
		return encodeURIComponent(val).replace(RESERVEDCHARS_RE, escape );
	}

	function addNamed(name, val) {
		return name + "=" + val;
	}

	function addLabeled(name, val) {
		return name + (val ? "=" : "") + val;
	}

	var re =  /\{([+#.\/;?&]?)((?:[\w%.]+(\*|:\d)?,?)+)\}/g

	var Joiners = {
		'':",", '+':",", '#':","
		//, ';':";"
		, '?':"&"
		//, '&':"&", '/':"/", '.':"."
	}
	var Fns = {
		";": addLabeled, "&": addNamed
	}



	function mapCleanJoin(arr, map, join) {
		return arr.map(map).filter(Boolean).join(join)
	}

		function work(data, _, op, vals) {
			var list = vals.split(",")
			, joiner = Joiners[op] || op
			, enc = op && joiner == "," ? encodeURI : encodeNormal
			, fn = Fns[joiner] || null
			, out = list.map(function(name){
				var temp
				, exp = name != (name = name.split("*")[0])
				, len = !exp && (temp = name.split(":"), name=temp[0], temp[1])
				, val = data[name]||""

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

				return fn ? fn(name, val) : val
			})
			.filter(Boolean)
			.join(joiner)


			return (op!="+"&&out?op:"") + out
				
		}

	function expand(template, data) {


		return template.replace(re, work.bind(null, data))
	}

	root.expand = expand
}(this);

