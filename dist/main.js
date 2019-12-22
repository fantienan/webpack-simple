(function(graph){
            function require(module){
                function reRequire(relativePath) {
                    return require(graph[module].dependencies[relativePath])
                };
                var exports = {};
                (function(require,exports,code) {
                    eval(code)
                })(reRequire,exports,graph[module].code)
                return exports;
            }
            require('./src/index.js')
        })({
  "./src/index.js": {
    "dependencies": {
      "./expo.js": ".\\src\\expo.js"
    },
    "code": "\"use strict\";\n\nvar _expo = require(\"./expo.js\");\n\nconsole.log(\"hello webpack!!!add:\" + (0, _expo.add)(1, 2));"
  },
  ".\\src\\expo.js": {
    "dependencies": {
      "./test.js": ".\\src\\test.js"
    },
    "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.minus = exports.add = void 0;\n\nvar _test = _interopRequireDefault(require(\"./test.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nvar add = function add(a, b) {\n  console.log(a + b);\n};\n\nexports.add = add;\n\nvar minus = function minus(a, b) {\n  console.log(a - b);\n};\n\nexports.minus = minus;"
  },
  ".\\src\\test.js": {
    "dependencies": {},
    "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = test;\n\nfunction test() {\n  console.log(\"test\");\n}"
  }
})