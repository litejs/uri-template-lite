!function(m){function n(e){return encodeURIComponent(e).replace(p,escape)}function f(e,a,b){return e+(a||"&"==b?"=":"")+a}function k(e,a,b){return e.map(a).filter(Boolean).join(b)}function q(e,a,b,f){var d=r[b]||b,h=b&&","==d?encodeURI:n,l=s[d];a=k(f.split(","),function(a){var b=a!=(a=a.split("*")[0]),g=!b&&(g=a.split(":"),a=g[0],g[1]),c=e[a];if(a in e){if(Array.isArray(c)){if(0==c.length)return;c=k(c,h,b?d+(";"==d||"&"==d?a+"=":""):",")}else if("object"==typeof c){var f=b?"=":",",c=k(Object.keys(c),
function(a){return a in c&&h(a)+f+h(c[a])},!b||"/"!=d&&";"!=d&&"&"!=d?",":d);if(0==c.length)return;b&&(l=null)}else c=h(g?c.slice(0,g):c);return l?l(a,c,d):c}},d);return("+"!=b&&a?b:"")+a}var p=/[\]\[:\/?#@!$&()*+,;=']/g,t=/\{([+#.\/;?&]?)((?:[\w%.]+(\*|:\d)?,?)+)\}/g,r={"":",","+":",","#":",","?":"&"},s={";":f,"&":f};m.expand=function(e,a){return e.replace(t,q.bind(null,a))}}(this);