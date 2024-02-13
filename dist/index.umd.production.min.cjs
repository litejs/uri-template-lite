!function(e, n) {
  "object" == typeof exports && "undefined" != typeof module ? n(exports) : "function" == typeof define && define.amd ? define([ "exports" ], n) : n((e = "undefined" != typeof globalThis ? globalThis : e || self).UriTemplateLite = {});
}(this, (function(e) {
  "use strict";
  var n = /[!'()]/g, t = {
    "": ",",
    "+": ",",
    "#": ",",
    "?": "&"
  }, r = /[$-/?[-^{|}]/g, a = /\{([#&+./;?]?)((?:[-\w%.]+(\*|:\d+)?(?:,|(?=})))+)\}/g, o = RegExp(a.source + "|.[^{]*?", "g");
  function encodeNormal(e) {
    return encodeURIComponent(e).replace(n, escape);
  }
  function escapeFn(e) {
    return e.replace(r, "\\$&");
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
  function expand(e, n, r) {
    return e.replace(a, (function(e, a, o) {
      var p = t[a] || a, c = ";" == p || "&" == p, l = a && "," == p ? encodeURI : r && r.encoder || encodeNormal, i = mapCleanJoin(o.split(","), (function(e) {
        var t = e.split(/[*:]/), r = t[0], a = n[r];
        if (null != a) {
          if ("object" == typeof a) {
            if (t = r != e, Array.isArray(a) ? a = mapCleanJoin(a, l, t ? c ? p + r + "=" : p : ",") : (a = mapCleanJoin(Object.keys(a), (function(e) {
              return l(e) + (t ? "=" : ",") + l(a[e]);
            }), t && (c || "/" == p) ? p : ","), t && (c = 0)), !a) return;
          } else a = l(t[1] ? a.slice(0, t[1]) : a);
          return c ? r + (a || "&" == p ? "=" + a : a) : a;
        }
      }), p);
      return i || "" === i ? "+" != a ? a + i : i : "";
    }));
  }
  function Template(e, n) {
    var r = this, a = Object.assign({
      decoder: catchDecode
    }, n), p = 0, c = {}, l = "", i = "^" + e.replace(o, (function(e, n, r) {
      if (!r) return escapeFn(e);
      var a = t[n] || n, o = ";" == a || "&" == a;
      return r.split(",").map((function(e, t) {
        var r = e.split(/[*:]/), i = r[0], u = (c[i] || "(") + ".*?)";
        return p++, r[1] && (u = "((?:%..|.){1," + r[1] + "})", c[i] = "(\\" + p), l += "t=($[" + p + "]||'').split('" + (r[1] ? o ? a + i + "=" : a : ",") + "').map(d);", 
        l += 'o["' + i + '"]=' + ("" === r[1] ? "t;" : "t.length>1?t:t[0];"), u = escapeFn(0 === t ? "+" === n ? "" : n : a) + (o ? escapeFn(i) + "(?:=" + u + ")?" : u), 
        "" === r[1] ? "(?:" + u + ")?" : u;
      })).join("");
    })) + "$", u = RegExp(i), d = Function("$,d", "var t,o={};" + l + "return o");
    r.template = e, r.match = function(e) {
      var n = u.exec(e);
      return n && d(n, a.decoder);
    }, r.expand = function(n) {
      return expand(e, n, a);
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
  }), e.Template = Template, e.default = Template, e.expand = expand, Object.defineProperty(e, "__esModule", {
    value: !0
  });
}));
//# sourceMappingURL=index.umd.production.min.cjs.map
