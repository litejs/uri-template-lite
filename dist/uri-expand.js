/*
    MIT License
*/
!function(h){function p(a){return encodeURIComponent(a).replace(q,escape)}function r(a,e,l){return a+(e||"&"==l?"=":"")+e}function t(a){return"string"==typeof a}function m(a,e,l){a=a.map(e).filter(t);return a.length&&a.join(l)}function n(a,e){return a.replace(u,function(a,c,h){var d=v[c]||c,k=c&&","==d?encodeURI:p,f=(";"==d||"&"==d)&&r;return(a=m(h.split(","),function(a){var c=a!=(a=a.split("*")[0]),g=!c&&(g=a.split(":"),a=g[0],g[1]),b=e[a];if(null!=b){if("object"==typeof b){if(Array.isArray(b)?b=
m(b,k,c?f?d+a+"=":d:","):(b=m(Object.keys(b),function(a){return k(a)+(c?"=":",")+k(b[a])},c&&(f||"/"==d)?d:","),c&&(f=null)),!b)return}else b=k(g?b.slice(0,g):b);return f?f(a,b,d):b}},d))||""===a?"+"!=c?c+a:a:""})}var q=/[\]\[:\/?#@!$&()*+,;=']/g,v={"":",","+":",","#":",","?":"&"},u=/\{([+#.\/;?&]?)((?:[\w%.]+(\*|:\d)?,?)+)\}/g;h.expand=n;h.Template=function(a){this.expand=n.bind(this,a)}}(this.URI||(this.URI={}));
