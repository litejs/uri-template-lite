"use strict";

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
    var o = n[r] || r, p = ";" == o || "&" == o, l = r && "," == o ? encodeURI : a && a.encoder || encodeNormal, u = mapCleanJoin(c.split(","), (function(e) {
      var n = e.split(/[*:]/), r = n[0], a = t[r];
      if (null != a) {
        if ("object" == typeof a) {
          if (n = r != e, Array.isArray(a) ? a = mapCleanJoin(a, l, n ? p ? o + r + "=" : o : ",") : (a = mapCleanJoin(Object.keys(a), (function(e) {
            return l(e) + (n ? "=" : ",") + l(a[e]);
          }), n && (p || "/" == o) ? o : ","), n && (p = 0)), !a) return;
        } else a = l(n[1] ? a.slice(0, n[1]) : a);
        return p ? r + (a || "&" == o ? "=" + a : a) : a;
      }
    }), o);
    return u || "" === u ? "+" != r ? r + u : u : "";
  }));
}

function Template(e, t) {
  var r = this, c = Object.assign({
    decoder: catchDecode
  }, t), o = 0, p = {}, l = "", u = "^" + e.replace(a, (function(e, t, r) {
    if (!r) return escapeFn(e);
    var a = n[t] || t, c = ";" == a || "&" == a;
    return r.split(",").map((function(e, n) {
      var r = e.split(/[*:]/), u = r[0], i = (p[u] || "(") + ".*?)";
      return o++, r[1] && (i = "((?:%..|.){1," + r[1] + "})", p[u] = "(\\" + o), l += "t=($[" + o + "]||'').split('" + (r[1] ? c ? a + u + "=" : a : ",") + "').map(d);", 
      l += 'o["' + u + '"]=' + ("" === r[1] ? "t;" : "t.length>1?t:t[0];"), i = escapeFn(0 === n ? "+" === t ? "" : t : a) + (c ? escapeFn(u) + "(?:=" + i + ")?" : i), 
      "" === r[1] ? "(?:" + i + ")?" : i;
    })).join("");
  })) + "$", i = RegExp(u), d = Function("$,d", "var t,o={};" + l + "return o");
  r.template = e, r.match = function(e) {
    var n = i.exec(e);
    return n && d(n, c.decoder);
  }, r.expand = function(n) {
    return expand(e, n, c);
  };
}

Object.defineProperty(Template, "__esModule", {
  value: !0
}), Object.defineProperty(Template, "Template", {
  value: Template
}), Object.defineProperty(Template, "default", {
  value: Template
}), Object.defineProperty(Template, "expand", {
  value: expand
}), module.exports = Template;
//# sourceMappingURL=index.cjs.production.min.cjs.map
