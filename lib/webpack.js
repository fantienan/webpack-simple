const fs = require("fs")
const path = require("path")
// 获取抽象语法树
const parser = require("@babel/parser")
// 分析抽象语法树
const traverse = require("@babel/traverse").default
const { transformFromAst } = require("@babel/core");

module.exports = class Webpack {
    constructor(options) {
        const { entry, output } = options
        this.entry = entry
        this.output = output
        this.modules = []
    }
    run() {
        // 模块分析：读取⼊⼝⽂件，分析代码
        const info = this.parse(this.entry)
        this.modules.push(info)
        for (let i = 0; i < this.modules.length; i++) {
            const item = this.modules[i];
            const { dependencies } = item
            for (let key in dependencies) {
                this.modules.push(this.parse(dependencies[key]))
            }
        }
        const obj = {}
        this.modules.forEach(item => {
            obj[item.entryFile] = {
                dependencies: item.dependencies,
                code: item.code
            }
        })
        this.file(obj)
    }

    parse(entryFile) {

        const content = fs.readFileSync(entryFile, "utf-8")
        // 获取抽象语法树
        const ast = parser.parse(content, {
            sourceType: "module"
        })
        const dependencies = {};
        //分析ast抽象语法树，根据需要返回对应数据，
        //根据结果返回对应的模块，定义⼀个数组，接受⼀下node.source.value的值
        traverse(ast, {
            ImportDeclaration({ node }) {
                // 获取依赖模块的相对路径
                const relativePath = node.source.value
                // 获取入口文件依赖模块的绝对路径
                const newPath = ".\\" + path.join(path.dirname(entryFile), relativePath);
                // 原始路径：绝对路径
                dependencies[node.source.value] = newPath
            }
        });
        // 把代码处理成浏览器可运⾏的代码，需要借助@babel/core，
        // 和@babel/preset-env，把ast语法树转换成合适的代码
        const { code } = transformFromAst(ast, null, {
            presets: ["@babel/preset-env"]
        })
        return {
            entryFile,
            dependencies,
            code
        }
    }
    file(code) {
        // 生成输出文件的目录地址
        const filePath = path.join(this.output.path, this.output.filename)
        const newCode = JSON.stringify(code, null, 2)
        // webpack 启动器
        const bundle = `(function(graph){
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
            require('${this.entry}')
        })(${newCode})`

        fs.writeFileSync(filePath, bundle)
    }
}