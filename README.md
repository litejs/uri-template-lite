
[1]: https://badgen.net/coveralls/c/github/litejs/uri-template-lite
[2]: https://coveralls.io/r/litejs/uri-template-lite
[3]: https://badgen.net/packagephobia/install/uri-template-lite
[4]: https://packagephobia.now.sh/result?p=uri-template-lite
[5]: https://badgen.net/badge/icon/Buy%20Me%20A%20Tea/orange?icon=kofi&label
[6]: https://www.buymeacoffee.com/lauriro


URI Template Lite &ndash; [![Coverage][1]][2] [![size][3]][4] [![Buy Me A Tea][5]][6]
=================

URI Template [RFC 6570](http://tools.ietf.org/html/rfc6570) expansion and extraction.


Usage
-----

`npm install uri-template-lite`

```javascript
var UriTemplate = require("uri-template-lite")

// Call `expand` directly
var data = {"domain":"example.com", "user":"fred", "query":"mycelium"}
UriTemplate.expand("http://{domain}/~{user}/foo{?query,number}", data)
// Returns http://example.com/~fred/foo?query=mycelium

// ..or use `Template` constructor
var template = new UriTemplate("http://{domain}/~{user}/foo{?query,number}")
template.expand({"domain":"example.com", "user":"fred", "query":"mycelium", "number": 3})
// Returns http://example.com/~fred/foo?query=mycelium&number=3

// Extract variables
template.match("http://example.com/~fred/foo?query=mycelium&number=3")
// Returns {"domain":"example.com", "user":"fred", "query":"mycelium", "number": "3"}

template.match("http://other.com/?query=mycelium")
// Returns null
```



About error handling
--------------------

This implementation tries to do a best effort template expansion
and leaves erroneous expressions in the returned URI
instead of throwing errors.
So for example, the incorrect expression
{unclosed will return {unclosed as output.



> Copyright (c) 2014-2023 Lauri Rooden &lt;lauri@rooden.ee&gt;  
[MIT License](https://litejs.com/MIT-LICENSE.txt) |
[GitHub repo](https://github.com/litejs/uri-template-lite) |
[npm package](https://npmjs.org/package/@litejs/uri-template-lite) |
[Buy Me A Tea][6]


