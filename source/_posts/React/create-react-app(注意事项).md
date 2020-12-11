---
type: blog
title: create-react-app(注意事项)
categories:
  - 前端
tags:
  - create-react-app
  - react
abbrlink: 6a5e2f06
date: 2020-9-9 18:01:00
---

## React.createClass is not a function

在React16以上，已经摒弃React.createClass()这个方法

取而代之的是
```
class Welcome extends React.Component{}
```


**配置webpack**

前置条件(precondition)

- [Creating a New Application](https://link.jianshu.com/?t=https://reactjs.org/docs/installation.html)

- 安装yarn

  ```
  npm install yarn -g
  ```

- 安装依赖

  ```
  yarn install
  ```

- 显示webpack配置

  ```
  npm run eject
  ```

- 添加alias

  可以根据项目自行配置

  ```
  alias: {
  	'react-native': 'react-native-web', 
  	'src':path.join(__dirname, '..', 'src'), 
  	'language':path.join(__dirname, '..', 'src/language'), 
  	'router':path.join(__dirname, '..', 'src/router'), 
  	'Modebase':path.join(__dirname, '..', 'src/Modebase'), 
  	'containers':path.join(__dirname, '..', 'src/containers') 
  }
  ```

- 添加cssnext(postcs)
  一种可以让你使用CSS最新特性的插件。它通过将最新的CSS特性转变为现阶段浏览器所兼容的特性，这样你不用再等待浏览器对某一特定新特性的支持。

<!-- more -->

**修改webpack.config.dev.js添加postcss插件**

```
{ 
	loader: require.resolve('postcss-loader'), 
	options: { 
		ident: 'postcss', 
		plugins: () => [ 
			require('postcss-flexbugs-fixes'), 
			require('postcss-cssnext', 
			{ browsers: ['last 2 version'] }
		], 
	} 
}
```



**webPack按需加载**

- 添加react-router4

  使用react-router-dom，参考[初探 React Router 4.0](https://link.jianshu.com/?t=http://blog.csdn.net/sinat_17775997/article/details/69218382)

  ```
  yarn add react-router-dom
  ```

- 在react-router4中进行代码拆分

  react-router升级到4后，便没有了getComponent这个参数。所以我们得换种方式，react-router4官方示例也提供了code splitting的方法，利用webpack结合bundle-loader，它是在require.ensure基础上封装的，更友好的实现异步加载过程。



**添加Bundle.js组件**

```
export default class Bundle extends Component { 
	constructor(props) { 
		super(props); 
		this.state = { mod: null }; 
	} 
	load = props => {
    	this.setState({ mod: null }); 
    	props.load(mod => { 
    		this.setState({ mod: mod ? mod : null }); }); 
    	} 
    componentWillMount() { 
    	this.load(this.props); 
    } 
    render() { 
    	return this.state.mod ? this.props.children(this.state.mod) : null 
    } 
}
```



**使用require.ensure()来进行模块的异步加载**

```
<Bundle load={(cb) => { require.ensure([], require => { cb(require('containers/Buttons/containers').default); },'Buttons'); }}> {(Buttons) => <Buttons {...props}/>} </Bundle>
```



**webPack提取公共模块**

- 首先把入口处改写为下面这样，把公共的方法提取出来

  ```
  entry: { 
  	app:[ 
  		require.resolve('./polyfills'), 
  		paths.appIndexJs,
  		require.resolve('react-error-overlay'), 
  		require.resolve('react-dev-utils/webpackHotDevClient') 
  	], 
  	vendor: ['react', 'react-dom', 'react-router','react-router-dom', 'mobx', 'mobx-react'] 
  }
  ```

- 提取公共模块

  ```
  new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.[hash:8].js' })
  ```

  

**Webpack DLL 用法**

Dll使用方法其实挺简单的。网上也有很多例子。

我遇到一些坑这里和大家说明一下

首先在主目录下面新建 webpack.dll.dev.js

```
const webpack = require('webpack'); 
const path = require('path'); 
module.exports = { 
	entry: { 
		vendor: [path.join(__dirname, 'src', 'vendor.js')], 
	}, 
	output: { 
		path: path.join(__dirname, 'dll'), 
		filename: '[name].js', 
		library: '[name]', 
	}, 
    plugins: [ 
    	new webpack.DllPlugin({ path: path.join(__dirname, 'dll', '[name]-manifest.json'), filename: '[name].js', name: '[name]', }), ] 
};
```



这个Webpack文件主要的功能是在根目录生成dll文件夹。里面包含有vendor.js（index.html需要添加的js）和vendor-manifest.json （DllPlugin生成的json文件）

在主webpack文件里面通过DllReferencePlugin插件引用

然后再package.json里面添加

webpack --config webpack.dll.dev.js

然后在主webpack文件添加如下代码

```
const manifest = require('../dll/vendor-manifest.json'); plugins: [ new webpack.DllReferencePlugin({ manifest }) ]
```



下面就是dll比较坑的地方，如何在index.html中引入verdor.js呢。

首先我们思考直接在public底下的index.html中直接引用，这个dllplugin的包并不会被打进内存里，需要指定一个static目录

解决办法使用AddAssetHtmlPlugin

在htmlwebpack后插入一个AddAssetHtmlPlugin插件，用于将vendor插入打包后的页面 

```
new AddAssetHtmlPlugin({ filepath: require.resolve('../dll/vendor.js'), includeSourcemap: false })
```

节省了近30S!!!



**使用UglifyJsPlugin压缩代码**

```
new webpack.optimize.UglifyJsPlugin({ compressor: { warnings: false, } })
```



**添加ANTD全局组件和css**

[修改webpack](https://www.jianshu.com/p/a46e30d7ef39)