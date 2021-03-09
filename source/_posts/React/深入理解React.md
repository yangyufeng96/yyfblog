---
type: blog
title: 深入理解React
categories:
  - 前端
tags:
  - React
abbrlink: 93b51ba9
date: 2021-03-08 00:00:00
---

### React中响应式原理

1.开发者只需关注状态转移（数据），当状态发生变化，React框架会自动根据新的状态重新构建UI。

2.React框架在接收到用户状态改变通知后，会根据当前渲染树，结合最新的状态改变，通过Diff算法，计算出树中变化的部分，然后只更新变化的部分（DOM操作），从而避免整棵树重构，提高性能。状态变化后React框架并不会立即去计算并渲染DOM树的变化部分，相反，React会在DOM的基础上建立一个抽象层，即虚拟DOM树，对数据和状态所做的任何改动，都会被自动且高效的同步到虚拟DOM，最后再批量同步到真实DOM中，而不是每次改变都去操作一下DOM。

**为什么不能每次改变都直接去操作DOM树？**

这是因为在浏览器中每一次DOM操作都有可能引起浏览器的重绘或回流：

* 如果DOM只是外观风格发生变化，如颜色变化，会导致浏览器重绘界面。
* 如果DOM树的结构发生变化，如尺寸、布局、节点隐藏等导致，浏览器就需要回流（及重新排版布局）。
而浏览器的重绘和回流都是比较昂贵的操作，如果每一次改变都直接对DOM进行操作，这会带来性能问题，而批量操作只会触发一次DOM更新。

 **数据发生变化，页面改变的原理：** 

比较虚拟的dom 不怎么损耗性能，真实的dom比较会损耗性能 

1.state 数据

2.jsx 模板

3.生成虚拟的dom

3.数据和模板结合，生成虚拟的dom

4.用虚拟的Dom 来生成真实的Dom,来显示

5.state 发生改变

6.数据和模板结合，生成虚拟的dom

7.比较新的虚拟Dom和旧的虚拟Dom，找出差别，改变

8.直接操作Dom,改变内容

jsx语法 => React.createElement=> 虚拟的Dom =>真实的Dom
```js
<div><span></span></div> ===  React.createElement('div',{ },React.createElement('span',{}))
```
### **props, state与render函数关系 – 数据和页面互相联动的底层机制**

当组件的state或者props发生改变的时候，自己的render函数就会重新执行。

注意：当父组件的render被执行的时候，子组件的也render会被重新执行一次（因为在父组件的render里面）。

也就是说当绑定的事件改变了state或者props，render函数就会重新执行解析页面，这个时候解析的时候就会使用新的数据了，所以页面就会变化。

### **React中的虚拟DOM**

刚才提到只要state、props改变就会重新render，可以想象要不断的重新渲染页面对性能要求非常高，实际上render的性能是非常高的，这是归功于虚拟DOM。

首先明确DOM的相关操作需要调用web application对性能损耗是比较高的。

**先看看常规的思路**

<!-- more -->

1. state数据
2. JSX模板
3. 数据+模板相结合，生成真实的DOM来显示
4. tate改变
5. 数据+模板相结合，生成真实的DOM，替换原始的DOM
   缺陷在于：第一次生成了一个完整的DOM片段，第二次又生成了一个完整的DOM片段，第二次的DOm替换第一次的DOM，这样生成、替换非常的消耗性能

**改良思路（仍然使用DOM）**

1. state数据
2. JSX模板
3. 数据+模板相结合，生成真实的DOM来显示
4. tate改变
5. 数据+模板相结合，生成真实的DOM，并不直接替换原始的DOM
6. 新的DOM（文档碎片）原始的DOM作对比，找差异（性能损耗大）
7. 找出发生了什么变化，比如找出了只有input框有差异
8. 只用新的DOM中的input元素替换掉老的DOM中的input元素
   缺陷在于：性能提升并不明显，因为性能消耗在了比对上

**React的思路**

1. state数据
2. JSX模板
3. 数据+模板相结合，生成虚拟DOM（虚拟DOM就是一个JS数组对象，完整的描述真实的DOM）(` [ ‘ idv ‘ , { id : ‘ abc ‘ } , [ ‘ span ‘ , { } , ‘ hello ‘ ] ] `) （用js生成js对象性能损耗极小，生成dom性能损耗大要调用web application）
4. 用虚拟DOM的结构，生成真实的DOM，来显示(`<div id='abc'><span>hello</span></div>`)
5. state发生变化(`<div id='abc'><span>bye</span></div>`)
6. 数据+模板生成新的虚拟DOM(` [ ‘ idv ‘ , { id : ‘ abc ‘ } , [ ‘ span ‘ , { } , ‘ bye ‘ ] ]` )（极大的提升了性能）
7. 比较原始虚拟DOM和新的虚拟DOM的区别，找到区别是span中的内容（极大的提升了性能）
8. 直接操作DOM改变span中的内容
   总结：减少了DOM对真实DOM的创建和对比，而创建和对比的是js对象，从而实现了极大的性能飞跃

### **深入理解虚拟DOM**

Vue和react的虚拟DOM的原理和步骤是完全一致的。

React中真实DOM的生成步骤：JSX -> createElement方法 -> JS对象(虚拟DOM) -> 真实的DOM

因此可见，JSX中的div等标签仅仅是JSX的语法，并不是DOM，仅用于生成JS对象

其实在React中创建虚拟DOM(js对象)使用的是（没有JSX语法也可以用下面的方式生成）

```js
// 传三个参数：标签 属性 内容
// <div>item</div>
// 所以其实没有JSX语法也可以用下面的方式生成
React.createElement('div', {}, 'item')
```

 虚拟DOM的优点： 

- 性能提升 DOM比对变成了js的比对
- 它使得跨平台应用得以实现，React Native（安卓和ios中没有DOM的概念，使用虚拟DOM(js对象)在所有应用中都可以被使用，然后变成原生客户端的组件）

### **虚拟DOM的Diff算法**

- Diff算法用于比较原始虚拟DOM和新的虚拟DOM的区别，即两个js对象该如何比对。
- diff算法全称叫做difference算法
- setState实际上是异步的，这是为了提升react底层的性能，是为了防止时间间隔很短的情况下-多次改变state，React会在这种情况下将几次改变state合并成一次从而提高性能。
- diff算法是同级比较，假设第一层两个虚拟DOM节点不一致，就不会往下比了，就会将原始页面虚拟DOM全部删除掉，然后用新的虚拟DOM进行全部的替换，虽然这有可能有一些性能的浪费，但是由于同层比对的算法性能很高，因此又弥补了性能的损耗。
-  做list循环的时候有一个key值，这样比对的时候就可以相对应的比对，找出要改变的，以及不需要渲染的，这样使用key做关联，极大的提升了虚拟DOM比对的性能，这要保证在新的虚拟DOM后key值不变，这就说明了为什么做list循环的时候key的值不要是index，因为这样没有办法保证原虚拟DOM和新虚拟DOM的key值一致性，而造成性能的损耗，一般这个key对应后台数据的唯一id字段，而不是循环的index。 

```js
getTodoItem(){
    return this.state.list.map((item,index)=>{
        return (
            <TodoItem
                key = {item}
                content={item}
                index={index}
                deleteItem = {this.handleItemDelete}
            />
        )
    })
}
```

 **React中ref的使用** 

- 在react中使用ref来操作DOM
- 在react中也可以使用e.target来获取DOM
- ref这个参数是一个函数

```js
<input
    id = "insertArea"
    className="input"
    value={this.state.inputValue}
    onChange={this.handleInputChange}
    ref={(input)=>{this.input = input}}
/>

handleInputChange(e){
    // const value = e.target.value; // 原始的方法
    const value = this.input.value;
    this.setState(() => ({
    	inputValue: value
    }))
}
```

- 一般情况下不推荐使用ref这种方法，因为setState是一个异步函数，因此去操作DOM的时候可能无法正确的输出页面的最新DOM情况，有时候比较复杂的操作如动画之类的，如果一定要使用，就需要在setState的第二个函数，这是个回调函数，在setState完成的时候触发。

```js
handleBtnClick(e){
    this.setState((prevState)=>({
        list: [...prevState.list, prevState.inputValue], // 展开运算符
        inputValue: '',
    }), ()=>{
        console.log(this.ul.querySelectorAll('div').length);
    });

}
```

### **React中的生命周期函数**

[![63HfDU.md.jpg](https://s3.ax1x.com/2021/03/09/63HfDU.md.jpg)](https://imgtu.com/i/63HfDU)

- 生命周期函数是指在某一个时刻组件会自动调用执行的函数
- reader函数就是一个生命周期函数的例子，当state或props时候改变的时刻救护自动调用执行
- constructor可以理解成一个生命周期函数，在组件被创建的时候就会被执行，但是它是es6语法，不是react特殊的语法

 **组件挂载的过程** 

- componentWillMount 在组件即将被挂载到页面的时刻自动执行，在渲染之前被执行
- render 进行挂载，是必须存在的
- componentDidMount 在组件被挂载到页面之后自动被执行
- 注意：在state和props改变的时候只有render会执行，componentWillMount和componentDidMount不会执行，他们只会在第一次挂载到页面的时候被执行

 **组件更新** 

- componentWillReceiveProps 两个条件都要满足1.当一个组件从父组件接收参数 2. 如果这个组件第一次存在于父组件中不会执行，如果这个组件之前已经存在于父组件中，才会执行
- shouldComponentUpdate 组件即将被更新之前会执行，如焦点input框的时候，会返回一个true和false来判断到底要不要更新
- componentWillUpdate 组件被更新之前会自动执行，在shouldComponent返回true之后才会执行
- componentDidUpdate 组件更新完成之后被执行

 **组件去除的过程** 

- componentWillUnmount：但这个组件即将被从页面中剔除的时候执行

### **生命周期函数的使用场景**

- 防止父组件render的时候子组件也要render，从而提升性能shouldComponentUpdate(nextProps,nextState){ if(nextProps.content !== this.props.content){ return true } return false }
- 页面初始化的时候在componentDidMount中发送AJAX请求（推荐），或者在constructor中，千万不要放在render里面，会造成死循环，也最好不要在componentWillMount中发AJAX，放这里面是没有问题的，但是如果在react native中会有问题。
- react没有内置ajax，使用axios