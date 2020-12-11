---
type: blog
layout: post
title: 手写简易版vue，minivue的实现
categories: 
	- 前端
tags: 
	- vue
abbrlink: d3643a0f
date: 2020-12-08 00:00:00
---

基于vue2.*

`vue采取数据劫持，配合观察者模式，通过Object.defineProperty() 来劫持各个属性的setter和getter，在数据变动时，发布消息给依赖收集器dep，去通知观察者，做出对应的回调函数，去更新视图。（也就是在getter中收集依赖，在setter中通知依赖更新。`

> 其实vue主要就是整合Observer，compile和watcher三者，通过Observer来监听 model数据变化表，通过compile来解析编译模板指令，最终利用Watcher搭起observer 和compile的通信桥梁，达到数据变化=>视图变化，视图变化=>数据变化的双向绑定效果。

 下面来一张图↓ 

[![rSsjT1.png](https://s3.ax1x.com/2020/12/08/rSsjT1.png)](https://imgchr.com/i/rSsjT1)

 这个流程图已经非常形象深刻的表达了vue的运行模式，当你理解了这个流程，再去看vue源码时就会容易很多了 

 声明一下，下面的代码只简单实现了vue里的 

1. v-model（数据的双向绑定）
2. v-bind/v-on
3. v-text/v-html
4. 没有实现虚拟dom，采用文档碎片（createDocumentFragment）代替
5. 数据只劫持了Object，数组Array没有做处理

 代码大致结构如下，初步定义了6个类 

[![rSyiOH.png](https://s3.ax1x.com/2020/12/08/rSyiOH.png)](https://imgchr.com/i/rSyiOH)

<!-- more -->

```
// 定义Vue类
class Vue {
    constructor(options) {
        // 把数据对象挂载到实例上
        this.$el = options.el;
        this.$data = options.data;
        this.$options = options;
        // 如果有需要编译的模板
        if (this.$el) {
            // 数据劫持 就是把对象的所有属性 改成get和set方法
            new Observer(this.$data);
            // 用数据和元素进行编译
            new Compiler(this.$el, this);
            // 3. 通过数据代理实现 主要给methods里的方法this直接访问data
            this.proxyData(this.$data);
        }
    }
    //用vm代理vm.$data
    proxyData(data){
        for(let key in data){
            Object.defineProperty(this,key,{
                get(){
                    return data[key];
                },
                set(newVal){
                    data[key] = newVal;
                }
            })
        }
    }
}
 
// 编译html模板
class Compiler {
    // vm就是vue对象
    constructor(el, vm) {
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        this.vm = vm;
        if(this.el){ // 如果该元素能获取到，我们开始编译
            // 1.把真实的dom放到内存中fragment文档碎片
            let fragment = this.node2fragment(this.el);
            // console.log(fragment);
            // 2.编译 => 提取想要的元素节点 v-model和文本节点{{}}
            this.compile(fragment);
            // 3.把编译好的fragment再放到页面里
            this.el.appendChild(fragment);
        }
    }
     
    /* 一些辅助方法 */
    isElementNode(node) {
        return node.nodeType === 1;
    }
    isDirective(name) { // 判断是不是指令
        return name.includes('v-');
    }
    isEventName(attrName){ // 判断是否@开头
        return attrName.startsWith('@');
    }
    isBindName(attrName){ // 判断是否:开头
        return attrName.startsWith(':');
    }
     
    /* 核心方法区 */
    node2fragment(el){ // 需要将el中的内容全部放到内存中
        // 文档碎片
        let fragment = document.createDocumentFragment();
        let firstChild;
        while(firstChild = el.firstChild){
            fragment.appendChild(firstChild);
        }
        return fragment; // 内存中的节点
    }
    compile(fragment){
        // 1.获取子节点
        let childNodes = fragment.childNodes;
        // 2.递归循环编译
        [...childNodes].forEach(node=>{
            if(this.isElementNode(node)){
                this.compileElement(node); // 这里需要编译元素
                this.compile(node); // 是元素节点，还需要继续深入的检查
            }else{
                // 文本节点
                // 这里需要编译文本
                this.compileText(node);
            }
        });
    }
    compileElement(node){ // 编译元素
        // 带v-model v-html ...
        let attrs = node.attributes; // 取出当前节点的属性
        // attrs是类数组，因此需要先转数组
        [...attrs].forEach(attr=>{
            // console.log(attr); // type="text" v-model="content" v-on:click="handleclick" @click=""...
            let attrName = attr.name; // type v-model v-on:click @click
            if(this.isDirective(attrName)){ // 判断属性名字是不是包含v-
                // 取到对应的值放到节点中
                let expr = attr.value; // content/变量 handleclick/方法名
                // console.log(expr)
                let [, type] = attrName.split('-'); // model html on:click
                let [compileKey, detailStr] = type.split(':'); // 处理 on: bind:
                // node this.vm.$data expr
                CompileUtil[compileKey](node, this.vm, expr, detailStr);
                // 删除有指令的标签属性 v-text v-html等，普通的value等原生html标签不必删除
                node.removeAttribute('v-' + type);
            }else if(this.isEventName(attrName)){ // 如果是事件处理 @click='handleClick'
                let [, detailStr] = attrName.split('@');
                CompileUtil['on'](node, this.vm, attr.value, detailStr);
                // 删除有指令的标签属性
                node.removeAttribute('@' + detailStr);
            }else if(this.isBindName(attrName)){ // 如果是:开头，动态绑定值
                let [, detailStr] = attrName.split(':');
                CompileUtil['bind'](node, this.vm, attr.value, detailStr);
                // 删除有指令的标签属性
                node.removeAttribute(':' + detailStr);
            }
        })
    }
    compileText(node){ // 编译文本
        // 带{{}}
        let expr = node.textContent; // 取文本中的内容
        let reg = /\{\{([^}]+)\}\}/g; // {{a}} {{b}}
        if(reg.test(expr)){
            // node this.$data
            // console.log(expr); // {{content}}
            CompileUtil['text'](node, this.vm, expr);
        }
    }
}
 
// 编译模版具体执行
const CompileUtil = {
    getVal(vm, expr){ // 获取实例上对应的数据
        expr = expr.split('.'); // [animal,dog]/[animal,cat]
        return expr.reduce((prev, next)=>{ // vm.$data.
            return prev[next];
        }, vm.$data)
    },
    // 这里实现input输入值变化时 修改绑定的v-model对应的值
    setVal(vm, expr, inputValue){ // [animal,dog]
        let exprs = expr.split('.'), len = exprs.length;
        exprs.reduce((data,currentVal, idx)=>{
            if(idx===len-1){
                data[currentVal] = inputValue;
            }else{
                return data[currentVal]
            }
        }, vm.$data)
    },
    getTextVal(vm, expr){ // 获取编译文本后的结果
        return expr.replace(/\{\{(.+?)\}\}/g, (...args)=>{
            // console.log(args); // ["{{title}}", "title", 0, "{{title}}"]
            // ["{{ animal.dog }}", " animal.dog ", 0, "{{ animal.dog }}-vs-{{ animal.cat }}"]
            return this.getVal(vm, args[1].trim());
        });
    },
    text(node, vm, expr){ // 文本处理
        let updateFn = this.updater['textUpdater'];
        // {{content}} => "welcome to animal world"
        let value;
        if(expr.indexOf('{{')!==-1){ // dom里直接写{{}}的时候
            value = this.getTextVal(vm, expr);
            // {{a}} {{b}} 对多个值进行监控
            expr.replace(/\{\{(.+?)\}\}/g, (...args)=>{
                new Watcher(vm, args[1].trim(), ()=>{
                    // 如果数据变化了，文本节点需要重新获取依赖的属性更新文本中的内容
                    updateFn && updateFn(node, this.getTextVal(vm, expr));
                })
            });
        }else{ // v-text 的时候
            value = this.getVal(vm, expr);
            new Watcher(vm, expr, (newVal)=>{
                // 当值变化后会调用cb 将新值传递过来
                updateFn && updateFn(node, newVal);
            });
        }
        updateFn && updateFn(node, value);
    },
    html(node, vm, expr) { //
        let updateFn = this.updater['htmlUpdater'];
        updateFn && updateFn(node, this.getVal(vm, expr));
    },
    model(node, vm, expr){ // 输入框处理
        let updateFn = this.updater['modelUpdater'];
        // console.log(this.getVal(vm, expr)); // "welcome to animal world"
        // 这里应该加一个监控 数据变化了  应该调用这个watch的callback
        new Watcher(vm, expr, (newVal)=>{
            // 当值变化后会调用cb 将新值传递过来
            updateFn && updateFn(node, newVal);
        });
        // 视图 => 数据 => 视图
        node.addEventListener('input', (e)=>{
            this.setVal(vm, expr, e.target.value);
        })
        updateFn && updateFn(node, this.getVal(vm, expr));
    },
    on(node, vm, expr, detailStr) {
        let fn = vm.$options.methods && vm.$options.methods[expr];
        node.addEventListener(detailStr, fn.bind(vm), false);
    },
    bind(node, vm, expr, detailStr){
        // v-bind:src='...' => href='...'
        node.setAttribute(detailStr, expr);
    },
    updater:{
        // 文本更新
        textUpdater(node, value){
            node.textContent = value;
        },
        // html更新
        htmlUpdater(node, value){
            node.innerHTML = value;
        },
        // 输入框更新
        modelUpdater(node, value){
            node.value = value;
        }
    }
}
 
// 观察者
class Observer{
    constructor(data){
        this.observe(data);
    }
    observe(data){
        // 要对data数据原有属性改成set和get的形式
        if(!data || typeof data !== 'object'){ // 不是对象就不劫持了
            return
        }
        // 要劫持 先获取到data的key和value
        Object.keys(data).forEach(key=>{
            this.defineReactive(data, key, data[key]); // 劫持
            this.observe(data[key]); // 深度递归劫持
        })
    }
    // 定义响应式
    defineReactive(obj, key, value){
        let dep = new Dep();
        // 在获取某个值的时候
        Object.defineProperty(obj, key, {
            enumerable: true, // 可枚举
            configurable: true, // 可修改
            get(){ // 当取值的时候
                // 订阅数据变化时，往Dev中添加观察者
                Dep.target && dep.addSub(Dep.target);
                return value;
            },
            // 采用箭头函数在定义时绑定this的定义域
            set: (newVal)=>{ // 更改data里的属性值的时候
                if(value === newVal) return;
                this.observe(newVal); // 如果设置新值是对象，劫持
                value = newVal;
                // 通知watcher数据发生改变
                dep.notify();
            }
        })
    }
}
 
// 观察者的目的就是给需要变化的那个元素增加一个观察者，当数据变化后执行对应的方法
class Watcher{
    constructor(vm, expr, cb) {
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        // 先获取一下老的值
        this.oldVal = this.getOldVal();
    }
    // 获取实例上对应的老值
    getOldVal(){
        // 在利用getValue获取数据调用getter()方法时先把当前观察者挂载
        Dep.target = this;
        const oldVal = CompileUtil.getVal(this.vm, this.expr);
        // 挂载完毕需要注销，防止重复挂载 (数据一更新就会挂载)
        Dep.target = null;
        return oldVal;
    }
    // 对外暴露的方法 通过回调函数更新数据
    update(){
        const newVal = CompileUtil.getVal(this.vm, this.expr);
        if(newVal !== this.oldVal){
            this.cb(newVal); // 对应watch的callback
        }
    }
}
 
// Dep类存储watcher对象，并在数据变化时通知watcher
class Dep{
    constructor(arg) {
        // 订阅的数组
        this.subs = []
    }
    addSub(watcher){
        this.subs.push(watcher);
    }
    notify(){ // 数据变化时通知watcher更新
        this.subs.forEach(w=>w.update());
    }
}
```

[vue源码解析](https://www.cnblogs.com/bobo1/category/1452477.html)

