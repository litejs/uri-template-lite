[1]: https://secure.travis-ci.org/litejs/uri-template-lite.png
[2]: https://travis-ci.org/litejs/uri-template-lite
[3]: https://coveralls.io/repos/litejs/uri-template-lite/badge.png
[4]: https://coveralls.io/r/litejs/uri-template-lite
[RFC 6570]: http://tools.ietf.org/html/rfc6570


URI Template &ndash; [![Build][1]][2] [![Coverage][3]][4]
============

URI Template [RFC 6570][] expansion and extraction in 1.5KB
that passes [URI Template Tests](https://github.com/uri-templates/uritemplate-test).


Usage
-----

```javascript
// Call `expand` directly
var data = {"domain":"example.com", "user":"fred", "query":"mycelium"}
URI.expand("http://{domain}/~{user}/foo{?query,number}", data)
// Returns http://example.com/~fred/foo?query=mycelium

// ..or use `Template` constructor
var data = {"domain":"example.com", "user":"fred", "query":"mycelium", "number": 3}
var template = new URI.Template("http://{domain}/~{user}/foo{?query,number}")
template.expand(data)
// Returns http://example.com/~fred/foo?query=mycelium&number=3

// Extract variables
template.match("http://example.com/~fred/foo?query=mycelium&number=3")
// Returns {"domain":"example.com", "user":"fred", "query":"mycelium", "number": "3"}

template.match("http://other.com/?query=mycelium")
// Returns false
```


Installation
------------

To use it in the browser, include uri-template-min.js in your site

```html
<script src=uri-template-min.js></script>
```

In node.js: `npm install uri-template-lite`

```javascript
var URI = require("uri-template-lite").URI
```


About error handling
--------------------

This implementation tries to do a best effort template expansion
and leaves erroneous expressions in the returned URI
instead of throwing errors.
So for example, the incorrect expression
{unclosed will return {unclosed as output.



Browser Support
---------------

It should work IE6 and up but automated testing is currently broken.

-   For older browsers it requires `browser-upgrade-lite` package
    or other ES5 polyfill.
-   FF3-4 `escape` should be patched to remove non-standard 2nd param,
    `browser-upgrade-lite` does that.



External links
--------------

 - [Source-code on Github](https://github.com/litejs/uri-template-lite)
 - [Package on npm](https://npmjs.org/package/uri-template-lite)
 - URI Template [RFC 6570][]


### Licence

Copyright (c) 2014-2019 Lauri Rooden &lt;lauri@rooden.ee&gt;  
[The MIT License](http://lauri.rooden.ee/mit-license.txt)




