# webpack-simple
- webpack的简单实现

## Install
- yarn install

## Start
-node bundle.js

## Dependencies 
- @babel/parser 获取ast
- @babel/traverse、@babel/core 分析抽象语法树把ast语法树转换成合适的代码

## ⾃⼰实现⼀个bundle
- 模块分析：读取⼊⼝⽂件，分析代码
- 分析依赖：使⽤babel7的@babel/parser工具分析内部的语法，包括es6，返回⼀个ast抽象语法树，
            用@babel/traverse获取依赖模块及code。递归解析依赖模块最后获得webpack启动器参数
- 创建启动器：抹平浏览器不识别的语法并生成浏览器能够执行的自执行函数       



