---
type: blog
title: vue面试题
categories:
  - 面试
tags:
  - 面试题
  - vue
abbrlink: bc152925
date: 2020-12-11 00:00:00
---

## Vue双向绑定实现原理？ 

vue实现数据双向绑定主要是：采用数据劫持结合发布者-订阅者模式的方式，通过 Object.defineProperty() 来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应监听回调。当把一个普通 Javascript 对象传给 Vue 实例来作为它的 data 选项时，Vue 将遍历它的属性，用 Object.defineProperty() 将它们转为 getter/setter。用户看不到 getter/setter，但是在内部它们让 Vue 追踪依赖，在属性被访问和修改时通知变化。

vue的数据双向绑定 将MVVM作为数据绑定的入口，整合Observer，Compile和Watcher三者，通过Observer来监听自己的model的数据变化，通过Compile来解析编译模板指令（vue中是用来解析 双花括弧），最终利用watcher搭起observer和Compile之间的通信桥梁，达到数据变化 —>视图更新；视图交互变化（input）—>数据model变更双向绑定效果。

- Observer 对所有数据的属性进行监听
- Compile 对每个元素节点的指令进行扫描跟解析,根据指令模板替换数据,以及绑定相应的更新函数
- Watcher 作为连接Observer 跟 Compile 之间的桥梁, 能够订阅接收到每个属性变动的通知,执行相应的回调函数

代码理解: 

```js
const Dep = function() {
	this.subs = []
};
Dep.prototype = {
	addSub: function(sub) {
		this.subs.push(sub)
	},
	notify: function() {
		this.subs.forEach(sub = > {
			sub.update()
		})
	},
};
const Watcher = function(vm, node, name) {
	Dep.target = this;
	this.name = name;
	this.node = node;
	this.vm = vm;
	this.update();
	Dep.target = null
};
Watcher.prototype = {
	update: function() {
		this.get();
		this.node.nodeValue = this.value
	},
	get: function() {
		this.value = this.vm[this.name]
	},
};
const compile = function(node, vm) {
	if (node.nodeType === 1) {
		let attr = node.attributes;
		for (let i = 0; i < attr.length; i++) {
			if (attr[i].nodeName === 'v-model') {
				let name = attr[i].nodeValue;
				node.addEventListener('input', e = > {
					vm[name] = node.value
				});
				node.value = vm[name];
				node.removeAttribute('v-model')
			}
		}
	}
	if (node.nodeType === 3) {
		if (/\{\{(.*)\}\}/.test(node.nodeValue)) {
			let name = RegExp.$1;
			name = name.trim();
			node.nodeValue = vm[name];
			new Watcher(vm, node, name)
		}
	}
};
const observe = data = > {
	if (!data || typeof data !== 'object') return 3344;
	Object.keys(data).forEach(key = > defineReactive(data, key, data[key]))
};
const defineReactive = (data, key, value) = > {
	const dep = new Dep();
	observe(value);
	Object.defineProperty(data, key, {
		get: () = > {
			if (Dep.target) dep.addSub(Dep.target);
			return value
		},
		set: function(newValue) {
			console.log(`数据已发生变化，新的值为$ {
				newValue
			}`);
			value = newValue;
			dep.notify()
		},
	})
};

function nodeToFragment(node, vm) {
	let flag = document.createDocumentFragment();
	let child;
	while ((child = node.firstChild)) {
		compile(child, vm);
		flag.appendChild(child)
	}
	return flag
}
function Vue(options) {
	let data = this.data = options.data;
	observe(data, this);
	let id = options.el;
	let dom = nodeToFragment(document.getElementById(id), data);
	document.getElementById(id).appendChild(dom)
}
let vm = new Vue({
	el: 'app',
	data: {
		text: 'example text',
	},
});
```



<!--more-->

## Vue-router有几种模式？如何实现呢？ 

>  在vue-router中有两种模式 

- history
  history 为 HTML5 Api,提供了丰富的router 相关属性， 比如history.back() 就能轻松的做到页面回退
- hash
  hash router 有一个明显的标志是url 中带有#， 我们可以通过监听url中的hash来进行路由跳转

**如何实现**

 **history** 

 在代码实现前，我们先看看history几个api 

- history.pushState 浏览器历史纪录添加记录
- history.replaceState 修改浏览器历史纪录中当前纪录
- history.popState 当history 发生变化时触发

 在结合代码理解: 

```javascript
class Routers {
	contructor() {
		this.routes = {};
		this.listerPopState()
	}
	init(path) {
		history.replaceState({
			path: path
		}, null, path);
		this.routes[path] && this.routes[path]()
	}
	route(path, callback) {
		this.routes[path] = callback
	}
	push(path) {
		history.pushState({
			path: path
		}, null, path);
		this.routes[path] && this.routes[path]()
	}
	listerPopState() {
		window.addEventListener('popstate', e = > {
			const path = e.state && e.state.path;
			this.routers[path] && this.routers[path]()
		})
	}
}
window.VueRouter = new Routers();
VueRouter.route('/', () = > console.log('JS')) VueRouter.route('/detail', () = > console.log('JS每日一题')) VueRouter.push('/detail')
```

 **hash router** 

 上面说过我们可以通过监听url中的hash来进行路由跳转 

 结合代码理解: 

```javascript
class Routers {
	constructor() {
		this.routes = {};
		this.currentUrl = '';
		this.refresh = this.refresh.bind(this);
		window.addEventListener('load', this.refresh, false);
		window.addEventListener('hashchange', this.refresh, false)
	}
	route(path, callback) {
		this.routes[path] = callback
	}
	push() {
		this.currentUrl = location.hash.slice(1) || '/';
		this.routes[this.currentUrl] && this.routes[this.currentUrl]()
	}
}
window.VueRouter = new Routers();
VueRouter.route('/', () = > console.log('JS')) VueRouter.route('/detail', () = > console.log('JS每日一题')) VueRouter.push('/detail')
```

 工作中不必太过纠结使用哪种模式，hash模式url中会带有#号，破坏url整体的美观性, history 需要服务端支持rewrite, 否则刷新会出现404现象 

## vue中keepalive怎么理解？

>  说在前面: keep-alive是vue源码中实现的一个组件, 感兴趣的可以研究源码 https://github.com/vuejs/vue/blob/dev/src/core/components/keep-alive.js 

**什么是keepalive**

我们平时开发中, 总有部分组件没有必要多次init, 我们需要将组件进行持久化，使组件状态维持不变，在下一次展示时， 也不会进行重新init

keepalive音译过来就是保持活着, 所以在vue中我们可以使用keepalive来进行组件缓存

基本使用

```
// 被keepalive包含的组件会被进行缓存
< keep - alive > < component / > < /keep-alive>
```

 上面提到被keepalive包含的组件不会被再次init，也就意味着不会重走生命周期函数, 但是平常工作中很多业务场景是希望我们缓存的组件在再次渲染的能做一些事情,vue为keepalive提供了两个额外的hook 

- activated 当keepalive包含的组件再次渲染的时候触发
- deactivated 当keepalive包含的组件销毁的时候触发

 注: 2.1.0 版本后keepalive包含但被exclude排除的组件不会有以上两个hook 

**参数**

 keepalive可以接收3个属性做为参数进行匹配对应的组件进行缓存 

- include 包含的组件
- exclude 排除的组件
- max 缓存组件的最大值

其中include,exclude可以为字符，数组，以及正则表达式
max 类型为字符或者数字

代码理解

```javascript
// 只缓存组件name为a或者b的组件
<keep-alive include = "a,b" > 
   <component: is = "currentView" /> 
</keep-alive>
// 组件名为c的组件不缓存
<keep-alive exclude="c">
  <component:is="currentView"/ > 
</keep-alive>
// 如果同时使用include,exclude,那么exclude优先于include， 下面的例子也就是只缓存a组件
<keep-alive include="a,b"exclude="b">
  <component:is="currentView"/ >
</keep-alive>
// 如果缓存的组件超过了max设定的值5，那么将删除第一个缓存的组件
<keep-alive exclude="c"max="5">
  <component:is="currentView"/ > 
</keep-alive>
```

**配合router使用**

```js
<!-- template -->
// 意思就是$router.meta.keepAlive值为真是将组件进行缓存
<keep-alive>
	<router-view v-if="$router.meta.keepAlive">
</router-view>
<router-view v-if="!$router.meta.keepAlive"></router-view>

//router配置
new Router({
	routes: [{
		name: 'a',
		path: '/a',
		component: A,
		meta: {
			keepAlive: true
		}
	}, {
		name: 'b',
		path: '/b',
		component: B
	}]
})
```

**总结**

 keepalive是一个抽象组件，缓存vnode，缓存的组件不会被mounted，为此提供activated 和 deactivated 钩子函数, 使用props max 可以控制缓存组件个数 

##  Vue.use中都发生了什么？ 

> 源码地址: https://github.com/vuejs/vue/blob/dev/src/core/global-api/use.js 

**定义**

vue.use()往全局注入一个插件，供全局真接使用, 不需要单独引用

代码理解:

```js
import Router from 'vue-router'
// 入口文件全局注入vue-router, 从而可以在全局使用this.$route
Vue.use(Router)
如果不使用vue.use那么需在组件中使用都得单独引入
// a.vue
import Router from 'vue-router'
// b.vue
import Router from 'vue-router'
```

理解了其基本使用及作用，我们来看一下vue.use中都发生了什么

源码很少，所以直接摘抄了

```js
Vue.use = function(plugin: Function | Object) { // flow语法, 检测参数是否是函数或对象
    // 拿到已安装插件列表
	const installedPlugins = (this._installedPlugins || (this._installedPlugins = [])) 
    // 如果已经安装，直接跳出方法
    if (installedPlugins.indexOf(plugin) > -1) {
		return this
	}
    // additional parameters
     
	// 取vue.use() 传入的参数
	const args = toArray(arguments, 1) 
    
	// 将vue对象填充到第一位, 最后的结构为[vue,arg1,arg2,...]
    args.unshift(this) 
    // 判断插件是否有install方法，如果有执行install方法，如果没有直接把插件当install执行
    if (typeof plugin.install === 'function') {
		plugin.install.apply(plugin, args)
	} else if (typeof plugin === 'function') {
		plugin.apply(null, args)
	}
    // 注册完成填充至已安装列表，保证每个插件只安装一次
	installedPlugins.push(plugin) 
    return this
}
```

 结合代码理解 

```js
// 代码摘抄自elementui入口文件
实现上就是在install中执行了全局注册的操作
// index.js
const install = function(Vue, opts = {}) {
	locale.use(opts.locale);
	locale.i18n(opts.i18n);
	components.forEach(component = > {
		Vue.component(component.name, component)
	});...
}
export
default {
	version: '2.5.4',
	locale: locale.use,
	i18n: locale.i18n,
	install,
	CollapseTransition,
	Loading,
	...
}
//  main.js
import demo from './idnex'
vue.use(demo)
```

**总结**

 vue.use()为注册全局插件所用，接收函数或者一个包含install属性的对象为参数，如果参数带有install就执行install, 如果没有就直接将参数当install执行, 第一个参数始终为vue对象, 注册过的插件不会重新注册 

## 简述一下Vue.js的template编译过程？

 看一下整个流程 

[![r32sIK.jpg](https://s3.ax1x.com/2020/12/17/r32sIK.jpg)](https://imgchr.com/i/r32sIK)

 从上图中我们可以看到compile是从mount后开始进行中, 整体逻辑分为三个部分 

- 解析器(parse) - 将 `模板字符串` 转换成 `elementASTs`
- 优化器(optimize) - 对 `AST` 进行静态节点标记，主要用来做虚拟DOM的渲染优化
- 代码生成器(generate) - 使用 `elementASTs` 生成 `render` 函数代码字符串

**开始前先解释一下AST**

AST(abstract syntax tree 抽象语法树), 是源代码的抽象语法结构的树状表现形式

从代码上简单理解一下

```js
< div class = "name" > JS每日一题 < /div>
//转成AST后会得到如下格式
[{
	"type": "tag",
	"name": "div",
	"attribs": {
		"class": "name"
	},
	"children": [{
		"data": "JS每日一题",
		"type": "text",
		"next": null,
		"startIndex": 18,
		"prev": null,
		"parent": "[Circular ~.0]",
		"endIndex": 24
	}],
	"next": null,
	"startIndex": 0,
	"prev": null,
	"parent": null,
	"endIndex": 30
}]
```

 AST会经过generate得到render函数，render的返回值是VNode

> VNode的源码可以见    https://github.com/vuejs/vue/blob/8a2dbf50105ea729125a42fecfe2c2f0371d7836/src/core/vdom/vnode.js 

**解析器(parse)**

> 源码地址 https://github.com/vuejs/vue/blob/8a2dbf50105ea729125a42fecfe2c2f0371d7836/src/compiler/parser/index.js 

 parse 的目标是把 template 模板字符串转换成 AST 树，它是一种用 JavaScript 对象的形式来描述整个模板。那么整个 parse 的过程是利用正则表达式顺序解析模板，当解析到开始标签、闭合标签、文本的时候都会分别执行对应的回调函数，来达到构造 AST 树的目的 

**优化器(optimize)**

>  源码地址 https://github.com/vuejs/vue/blob/8a2dbf50105ea729125a42fecfe2c2f0371d7836/src/compiler/optimizer.js 

 通过 optimize 把整个 AST 树中的每一个 AST 元素节点标记了 static 和 staticRoot, optimize 的过程，就是深度遍历这个 AST 树，去检测它的每一颗子树是不是静态节点，如果是静态节点则它们生成 DOM 永远不需要改变 

**代码生成器(generate)**

> 源码地址  https://github.com/vuejs/vue/blob/8a2dbf50105ea729125a42fecfe2c2f0371d7836/src/compiler/codegen/index.js 

 把优化后的 AST 树转换成可执行的代码 

**总结**

 首先通过parse将template解析成AST,其次optimize对解析出来的AST进行标记，最后generate将优化后的AST转换成可执行的代码 

##  Vue中的nextTick如何理解？ 

> 在vue中，数据发生变化之后DOM并不会立即变化，而是等同一事件循环中的所有数据变化完成之后，再统一进行视图更新 

 代码理解 

