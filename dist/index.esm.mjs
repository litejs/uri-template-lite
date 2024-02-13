var e = /[!'()]/g, n = {
  "": ",",
  "+": ",",
  "#": ",",
  "?": "&"
}, t = /[$-/?[-^{|}]/g, r = /\{([#&+./;?]?)((?:[-\w%.]+(\*|:\d+)?(?:,|(?=})))+)\}/g, a = RegExp(r.source + "|.[^{]*?", "g");

function encodeNormal(n) {
  return encodeURIComponent(n).replace(e, escape);
}

function escapeFn(e) {
  return e.replace(t, "\\$&");
}

function catchDecode(e) {
  try {
    return decodeURIComponent(e);
  } catch (n) {
    return e;
  }
}

function notNull(e) {
  return null != e;
}

function mapCleanJoin(e, n, t) {
  return (e = e.map(n).filter(notNull)).length && e.join(t);
}

function expand(e, t, a) {
  return e.replace(r, (function(e, r, c) {
    var o = n[r] || r, u = ";" == o || "&" == o, i = r && "," == o ? encodeURI : a && a.encoder || encodeNormal, p = mapCleanJoin(c.split(","), (function(e) {
      var n = e.split(/[*:]/), r = n[0], a = t[r];
      if (null != a) {
        if ("object" == typeof a) {
          if (n = r != e, Array.isArray(a) ? a = mapCleanJoin(a, i, n ? u ? o + r + "=" : o : ",") : (a = mapCleanJoin(Object.keys(a), (function(e) {
            return i(e) + (n ? "=" : ",") + i(a[e]);
          }), n && (u || "/" == o) ? o : ","), n && (u = 0)), !a) return;
        } else a = i(n[1] ? a.slice(0, n[1]) : a);
        return u ? r + (a || "&" == o ? "=" + a : a) : a;
      }
    }), o);
    return p || "" === p ? "+" != r ? r + p : p : "";
  }));
}

function Template(e, t) {
  var r = this, c = Object.assign({
    decoder: catchDecode
  }, t), o = 0, u = {}, i = "", p = "^" + e.replace(a, (function(e, t, r) {
    if (!r) return escapeFn(e);
    var a = n[t] || t, c = ";" == a || "&" == a;
    return r.split(",").map((function(e, n) {
      var r = e.split(/[*:]/), p = r[0], l = (u[p] || "(") + ".*?)";
      return o++, r[1] && (l = "((?:%..|.){1," + r[1] + "})", u[p] = "(\\" + o), i += "t=($[" + o + "]||'').split('" + (r[1] ? c ? a + p + "=" : a : ",") + "').map(d);", 
      i += 'o["' + p + '"]=' + ("" === r[1] ? "t;" : "t.length>1?t:t[0];"), l = escapeFn(0 === n ? "+" === t ? "" : t : a) + (c ? escapeFn(p) + "(?:=" + l + ")?" : l), 
      "" === r[1] ? "(?:" + l + ")?" : l;
    })).join("");
  })) + "$", l = RegExp(p), d = Function("$,d", "var t,o={};" + i + "return o");
  r.template = e, r.match = function(e) {
    var n = l.exec(e);
    return n && d(n, c.decoder);
  }, r.expand = function(n) {
    return expand(e, n, c);
  };
}

export { Template, Template as default, expand };
//# sourceMappingURL=index.esm.mjs.map
