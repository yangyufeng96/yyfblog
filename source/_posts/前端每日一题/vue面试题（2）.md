---
type: blog
title: vue面试题（2）
categories:
  - 前端
tags:
  - 面试题
  - vue
abbrlink: e210f74f
date: 2020-12-21 00:00:00
---

## v-if和v-for哪个优先级更高？

 分析：此题考查常识，文档中曾有[详细说明](https://cn.vuejs.org/v2/style-guide/#避免-v-if-和-v-for-用在一起必要)；也是一个很好的实践题目，项目中经常会遇到，能够看出面试者应用能力。 

思路分析：总分总模式

1. 先给出结论
2. 为什么是这样的
3. 它们能放一起吗
4. 如果不能，那应该怎样
5. 总结

回答范例：

1. v-for优先于v-if被解析
2. 我曾经做过实验，把它们放在一起，输出的渲染函数中可以看出会先执行循环再判断条件
3. 实践中也不应该把它们放一起，因为哪怕我们只渲染列表中一小部分元素，也得在每次重渲染的时候遍历整个列表。
4. 通常有两种情况下导致我们这样做：
   - 为了过滤列表中的项目 (比如 `v-for="user in users" v-if="user.isActive"`)。此时定义一个计算属性 (比如 `activeUsers`)，让其返回过滤后的列表即可。
   - 为了避免渲染本应该被隐藏的列表 (比如 `v-for="user in users" v-if="shouldShowUsers"`)。此时把 `v-if` 移动至容器元素上 (比如 `ul`、`ol`)即可。
5. 文档中明确指出**永远不要把 `v-if` 和 `v-for` 同时用在同一个元素上**，显然这是一个重要的注意事项。
6. 看过源码里面关于代码生成的部分

 知其所以然： 

 做个测试

```js
ƒ anonymous() {
	with(this) {
		return _c('div', {
			attrs: {
				"id": "app"
			}
		}, _l((items), function(item) {
			return (item.isActive) ? _c('div', {
				key: item.id
			}, [_v("\n      " + _s(item.name) + "\n    ")]) : _e()
		}), 0)
	}
}
```

 源码中找答案

> compiler/codegen/index.js 

<!-- more -->

## 你知道key的作用吗？

分析：这是一道特别常见的问题，主要考查大家对虚拟DOM和patch细节的掌握程度，能够反映面试者理解层次。

思路分析：总分总模式

1. 给出结论，key的作用是用于优化patch性能
2. key的必要性
3. 实际使用方式
4. 总结：可从源码层面描述一下vue如何判断两个节点是否相同

回答范例：

1. key的作用主要是为了更高效的更新虚拟DOM。
2. vue在patch过程中**判断两个节点是否是相同节点是key是一个必要条件**，渲染一组列表时，key往往是唯一标识，所以如果不定义key的话，vue只能认为比较的两个节点是同一个，哪怕它们实际上不是，这导致了频繁更新元素，使得整个patch过程比较低效，影响性能。
3. 实际使用中在渲染一组列表时key必须设置，而且必须是唯一标识，应该避免使用数组索引作为key，这可能导致一些隐蔽的bug；vue中在使用相同标签元素过渡切换时，也会使用key属性，其目的也是为了让vue可以区分它们，否则vue只会替换其内部属性而不会触发过渡效果。
4. 从源码中可以知道，vue判断两个节点是否相同时主要判断两者的key和元素类型等，因此如果不设置key，它的值就是undefined，则可能永远认为这是两个相同节点，只能去做更新操作，这造成了大量的dom更新操作，明显是不可取的。

 测试代码 

使用key:

[![r0ML9A.png](https://s3.ax1x.com/2020/12/21/r0ML9A.png)](https://imgchr.com/i/r0ML9A)

```js
// 首次循环patch A
A B C D E
A B F C D E

// 第2次循环patch B
B C D E
B F C D E

// 第3次循环patch E
C D E
F C D E

// 第4次循环patch D
C D
F C D

// 第5次循环patch C
C 
F C

// oldCh全部处理结束，newCh中剩下的F，创建F并插入到C前面
```



 不使用key 

[![r0QeBT.png](https://s3.ax1x.com/2020/12/21/r0QeBT.png)](https://imgchr.com/i/r0QeBT)

 源码中找答案 

>  src\core\vdom\patch.js - sameVnode() 

## 你了解vue中的diff算法吗？

题目分析：vue基于虚拟DOM做更新，diff又是其核心部分，因此常被问道，此题考查面试者深度。

答题思路：3w1h

1. 定义diff
2. 它的必要性
3. 它在哪里被使用
4. 它如何运作
5. 提升：说一些细节

回答范例：

1. diff算法是虚拟DOM技术的产物，vue里面实际叫做patch，它的核心实现来自于snabbdom；通过新旧虚拟DOM作对比（即patch），将变化的地方转换为DOM操作
2. 在vue 1中是没有patch的，因为界面中每个依赖都有专门的watcher负责更新，这样项目规模变大就会成为性能瓶颈，vue 2中为了降低watcher粒度，每个组件只有一个watcher，但是当需要更新的时候，怎样才能精确找到发生变化的地方？这就需要引入patch才行。
3. 组件中数据发生变化时，对应的watcher会通知更新并执行其更新函数，它会执行渲染函数获取全新虚拟dom：newVnode，此时就会执行patch比对上次渲染结果oldVnode和新的渲染结果newVnode。
4. patch过程遵循深度优先、同层比较的策略；两个节点之间比较时，如果它们拥有子节点，会先比较子节点；比较两组子节点时，会假设头尾节点可能相同先做尝试，没有找到相同节点后才按照通用方式遍历查找；查找结束再按情况处理剩下的节点；借助key通常可以非常精确找到相同节点，因此整个patch过程非常高效。

## vue中组件之间的通信方式？

 题目分析：

vue是组件化开发框架，所以对于vue应用来说组件间的数据通信非常重要。此题主要考查大家vue基本功，对于vue基础api运用熟练度。另外一些边界知识如provide/inject/$attrs/$listeners则体现了面试者的知识面。 

思路分析：总分

1. 总述知道的所有方式
2. 按组件关系阐述使用场景

 回答范例： 

1. 组件通信方式大体有以下8种：

- props
- $emit/$on
- $children/$parent
- $attrs/$listeners
- ref
- $root
- eventbus
- vuex

1. 根据组件之间关系讨论组件通信最为清晰有效

- 父子组件
  - `props`
  - `$emit`/`$on`
  - `$parent` / `$children`
  - `ref`
  - `$attrs` / `$listeners`
- 兄弟组件
  - `$parent`
  - `eventbus`
  - `vuex`
- 跨层级关系
  - `provide`/`inject`
  - `$root`
  - `eventbus`
  - `vuex`

## 简单说一说你对vuex理解？

 分析：此题考查实践能力，能说出用法只能60分。更重要的是对vuex设计理念和实现原理的解读。 

回答策略：3w1h

1. 首先给vuex下一个定义
2. vuex解决了哪些问题，解读理念
3. 什么时候我们需要vuex
4. 你的具体用法
5. 简述原理，提升层级

 首先是官网定义： 

>  Vuex 是一个专为 Vue.js 应用程序开发的**状态管理模式**。它采用**集中式**存储管理应用的所有组件的状态，并以相应的规则保证状态以一种**可预测**的方式发生变化。 

回答范例：

1. vuex是vue专用的状态管理库。它以全局方式集中管理应用的状态，并且可以保证状态变更的可预测性。
2. vuex主要解决的问题是多组件之间状态共享的问题，利用各种组件通信方式，我们虽然能够做到状态共享，但是往往需要在多个组件之间保持状态的一致性，这种模式很容易出现问题，也会使程序逻辑变得复杂。vuex通过把组件的共享状态抽取出来，以全局单例模式管理，这样任何组件都能用一致的方式获取和修改状态，响应式的数据也能够保证简洁的单向数据流动，我们的代码将变得更结构化且易维护。
3. vuex并非必须的，它帮我们管理共享状态，但却带来更多的概念和框架。如果我们不打算开发大型单页应用或者我们的应用并没有大量全局的状态需要维护，完全没有使用vuex的必要。一个简单的[store 模式](https://cn.vuejs.org/v2/guide/state-management.html#简单状态管理起步使用)就足够了。反之，Vuex 将会成为自然而然的选择。引用 Redux 的作者 Dan Abramov 的话说就是：Flux 架构就像眼镜：您自会知道什么时候需要它。
4. 我在使用vuex过程中有如下理解：首先是对核心概念的理解和运用，将全局状态放入state对象中，它本身一棵状态树，组件中使用store实例的state访问这些状态；然后有配套的mutation方法修改这些状态，并且只能用mutation修改状态，在组件中调用commit方法提交mutation；如果应用中有异步操作或者复杂逻辑组合，我们需要编写action，执行结束如果有状态修改仍然需要提交mutation，组件中调用这些action使用dispatch方法派发。最后是模块化，通过modules选项组织拆分出去的各个子模块，在访问状态时注意添加子模块的名称，如果子模块有设置namespace，那么在提交mutation和派发action时还需要额外的命名空间前缀。
5. vuex在实现单项数据流时需要做到数据的响应式，通过源码的学习发现是借用了vue的数据响应化特性实现的，它会利用Vue将state作为data对其进行响应化处理，从而使得这些状态发生变化时，能够导致组件重新渲染。

##  vue-router中如何保护路由？

 此题是考查项目实践能力，项目中基本都有路由守卫的需求，保护指定路由考查的就是这个知识点。 

答题整体思路：

1. 阐述vue-router中路由保护策略
2. 描述具体实现方式
3. 简单说一下它们是怎么生效的

回答范例：

1. vue-router中保护路由安全通常使用导航守卫来做，通过设置路由导航钩子函数的方式添加守卫函数，在里面判断用户的登录状态和权限，从而达到保护指定路由的目的。
2. 具体实现有几个层级：全局前置守卫beforeEach、路由独享守卫beforeEnter或组件内守卫beforeRouteEnter。以全局守卫为例来说，可以使用`router.beforeEach((to,from,next)=>{})`方式设置守卫，每次路由导航时，都会执行该守卫，从而检查当前用户是否可以继续导航，通过给next函数传递多种参数达到不同的目的，比如如果禁止用户继续导航可以传递next(false)，正常放行可以不传递参数，传递path字符串可以重定向到一个新的地址等等。
3. 这些钩子函数之所以能够生效，也和vue-router工作方式有关，像beforeEach只是注册一个hook，当路由发生变化，router准备导航之前会批量执行这些hooks，并且把目标路由to，当前路由from，以及后续处理函数next传递给我们设置的hook。

可能的追问：

1、能不能说说全局守卫、路由独享守卫和组件内守卫区别？

- 作用范围

- 组件实例的获取

  ```js
  beforeRouteEnter(to,from,next) {
  	next(vm => {
  		
  	})
  }
  ```
  
- 名称/数量/顺序 

  >1. 导航被触发。
  >2. 在失活的组件里调用离开守卫。
  >3. 调用全局的 `beforeEach` 守卫。
  >4. 在重用的组件里调用 `beforeRouteUpdate` 守卫 (2.2+)。
  >5. 在路由配置里调用 `beforeEnter`。
  >6. 解析异步路由组件。
  >7. 在被激活的组件里调用 `beforeRouteEnter`。
  >8. 调用全局的 `beforeResolve` 守卫 (2.5+)。
  >9. 导航被确认。
  >10. 调用全局的 `afterEach` 钩子。
  >11. 触发 DOM 更新。
  >12. 用创建好的实例调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数。
  >
  >

2、你项目中的路由守卫是怎么做的？

3、前后端路由一样吗？

4、前端路由是用什么方式实现的？

5、你前面提到的next方法是怎么实现的？

##  你了解哪些Vue性能优化方法？

 答题思路：根据题目描述，这里主要探讨Vue代码层面的优化 

 **路由懒加载** 

```js
const router = new VueRouter({
  routes: [
    { path: '/foo', component: () => import('./Foo.vue') }
  ]
})
```

**keep-alive缓存页面** 

```vue
<template>
  <div id="app">
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>
```

**使用v-show复用DOM**

```vue
<template>
  <div class="cell">
    <!--这种情况用v-show复用DOM，比v-if效果好-->
    <div v-show="value" class="on">
      <Heavy :n="10000"/>
    </div>
    <section v-show="!value" class="off">
      <Heavy :n="10000"/>
    </section>
  </div>
</template>
```

 **v-for 遍历避免同时使用 v-if** 

```vue
<template>
    <ul>
      <li
        v-for="user in activeUsers"
        :key="user.id">
        {{ user.name }}
      </li>
    </ul>
</template>
<script>
	export default {
        computed: {
          activeUsers: function () {
            return this.users.filter(function (user) {
             return user.isActive
            })
          }
        }
    }
</script>
```

 **长列表性能优化** 

- 如果列表是纯粹的数据展示，不会有任何改变，就不需要做响应化 

  ```js
  export default {
    data: () => ({
      users: []
    }),
    async created() {
      const users = await axios.get("/api/users");
      this.users = Object.freeze(users);
    }
  };
  ```

-  如果是大数据长列表，可采用虚拟滚动，只渲染少部分区域的内容 

  ```vue
  <recycle-scroller
    class="items"
    :items="items"
    :item-size="24"
  >
    <template v-slot="{ item }">
      <FetchItemView
        :item="item"
        @vote="voteItem(item)"
      />
    </template>
  </recycle-scroller>
  ```

  >  参考[vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)、[vue-virtual-scroll-list](https://github.com/tangbc/vue-virtual-scroll-list) 

-  事件的销毁 

   Vue 组件销毁时，会自动解绑它的全部指令及事件监听器，但是仅限于组件本身的事件。 

  ```js
  created() {
    this.timer = setInterval(this.refresh, 2000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
  ```

-  图片懒加载 

   对于图片过多的页面，为了加速页面加载速度，所以很多时候我们需要将页面内未出现在可视区域内的图片先不做加载， 等到滚动到可视区域后再去加载。 

  ```vue
  <img v-lazy="/static/img/1.png">
  ```

  >  参考项目：[vue-lazyload](https://github.com/hilongjw/vue-lazyload) 

-  第三方插件按需引入 

   像element-ui这样的第三方组件库可以按需引入避免体积太大。 

  ```js
  import Vue from 'vue';
  import { Button, Select } from 'element-ui';
  
   Vue.use(Button)
   Vue.use(Select)
  ```

-  无状态的组件标记为函数式组件 

  ```vue
  <template functional>
    <div class="cell">
      <div v-if="props.value" class="on"></div>
      <section v-else class="off"></section>
    </div>
  </template>
  
  <script>
  export default {
    props: ['value']
  }
  </script>
  ```

-  子组件分割 

  ```vue
  <template>
    <div>
      <ChildComp/>
    </div>
  </template>
  
  <script>
  export default {
    components: {
      ChildComp: {
        methods: {
          heavy () { /* 耗时任务 */ }
        },
        render (h) {
          return h('div', this.heavy())
        }
      }
    }
  }
  </script>
  ```

-  变量本地化 

  ```vue
  <template>
    <div :style="{ opacity: start / 300 }">
      {{ result }}
    </div>
  </template>
  
  <script>
  import { heavy } from '@/utils'
  
  export default {
    props: ['start'],
    computed: {
      base () { return 42 },
      result () {
        const base = this.base // 不要频繁引用this.base
        let result = this.start
        for (let i = 0; i < 1000; i++) {
          result += heavy(base)
        }
        return result
      }
    }
  }
  </script>
  ```

- SSR

##  说一说你对vue响应式理解？

 烂大街的问题，但却不是每个人都能回答到位。因为如果你只是看看别人写的网文，通常没什么底气，也经不住面试官推敲，但像我们这样即看过源码还造过轮子的，回答这个问题就会比较有底气。 

答题思路：

1. 啥是响应式？
2. 为什么vue需要响应式？
3. 它能给我们带来什么好处？
4. vue的响应式是怎么实现的？有哪些优缺点？
5. vue3中的响应式的新变化

回答范例：

1. 所谓数据响应式就是能够使数据变化可以被检测并对这种变化做出响应的机制。
2. mvvm框架中要解决的一个核心问题是连接数据层和视图层，通过数据驱动应用，数据变化，视图更新，要做到这点的就需要对数据做响应式处理，这样一旦数据发生变化就可以立即做出更新处理。
3. 以vue为例说明，通过数据响应式加上虚拟DOM和patch算法，可以使我们只需要操作数据，完全不用接触繁琐的dom操作，从而大大提升开发效率，降低开发难度。
4. vue2中的数据响应式会根据数据类型来做不同处理，如果是对象则采用Object.defineProperty()的方式定义数据拦截，当数据被访问或发生变化时，我们感知并作出响应；如果是数组则通过覆盖该数组原型的方法，扩展它的7个变更方法，使这些方法可以额外的做更新通知，从而作出响应。这种机制很好的解决了数据响应化的问题，但在实际使用中也存在一些缺点：比如初始化时的递归遍历会造成性能损失；新增或删除属性时需要用户使用Vue.set/delete这样特殊的api才能生效；对于es6中新产生的Map、Set这些数据结构不支持等问题。
5. 为了解决这些问题，vue3重新编写了这一部分的实现：利用ES6的Proxy机制代理要响应化的数据，它有很多好处，编程体验是一致的，不需要使用特殊api，初始化性能和内存消耗都得到了大幅改善；另外由于响应化的实现代码抽取为独立的reactivity包，使得我们可以更灵活的使用它，我们甚至不需要引入vue都可以体验。

##  你如果想要扩展某个Vue组件时会怎么做？

 此题属于实践题，着重考察大家对vue常用api使用熟练度，答题时不仅要列出这些解决方案，同时最好说出他们异同。 

答题思路：

按照逻辑扩展和内容扩展来列举，逻辑扩展有：mixins、extends、composition api；内容扩展有slots；

分别说出他们使用使用方法、场景差异和问题。

作为扩展，还可以说说vue3中新引入的composition api带来的变化

 回答范例： 

1. 常见的组件扩展方法有：mixins，slots，extends等

2. 混入mixins是分发 Vue 组件中可复用功能的非常灵活的方式。混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被混入该组件本身的选项。

   ```js
   // 复用代码：它是一个配置对象，选项和组件里面一样
   const mymixin = {
   	methods: {
   		dosomething(){}
   	}
   }
   // 全局混入：将混入对象传入
   Vue.mixin(mymixin)
   
   // 局部混入：做数组项设置到mixins选项，仅作用于当前组件
   const Comp = {
   	mixins: [mymixin]
   }
   ```

3.  插槽主要用于vue组件中的内容分发，也可以用于组件扩展。 

    子组件Child 

   ```vue
   <div>
     <slot>这个内容会被父组件传递的内容替换</slot>
   </div>
   ```

    父组件Parent 

   ```vue
   <div>
   	<Child>来自老爹的内容</Child>
   </div>
   ```

    如果要精确分发到不同位置可以使用具名插槽，如果要使用子组件中的数据可以使用作用域插槽。 

4.  组件选项中还有一个不太常用的选项extends，也可以起到扩展组件的目的 

   ```js
   // 扩展对象
   const myextends = {
   	methods: {
   		dosomething(){}
   	}
   }
   // 组件扩展：做数组项设置到extends选项，仅作用于当前组件
   // 跟混入的不同是它只能扩展单个对象
   // 另外如果和混入发生冲突，该选项优先级较高，优先起作用
   const Comp = {
   	extends: myextends
   }
   
   ```

5.  混入的数据和方法不能明确判断来源且可能和当前组件内变量产生命名冲突，vue3中引入的composition api，可以很好解决这些问题，利用独立出来的响应式模块可以很方便的编写独立逻辑并提供响应式的数据，然后在setup选项中有机组合使用。例如： 

   ```js
   // 复用逻辑1
   function useXX() {}
   // 复用逻辑2
   function useYY() {}
   // 逻辑组合
   const Comp = {
   	setup() {
   		const {xx} = useXX()
   		const {yy} = useYY()
   		return {xx, yy}
   	}
   }
   ```

 可能的追问 :

 Vue.extend方法你用过吗？它能用来做组件扩展吗？ 

##  Vue2和Vue3中的响应式原理对比，分别的具体实现思路
此题非常好，既考察深度又考察广度，面试者要对两个版本的响应式原理都有深入理解才能答好。

 答题思路：

1. 可以先说vue2响应式原理
2. 然后说出它的问题
3. 最后说出vue3是怎么解决的

 回答范例：

1. vue2数据响应式实现根据对象类型做不同处理，如果是object，则通过`Object.defineProperty(obj,key,descriptor)`拦截对象属性访问

   ```js
   function defineReactive(obj, key, val) {
     Object.defineProperty(obj, key, {
       get() {
         return val
       },
       set(v) {
         val = v
         notify()
       }
     })
   }
   ```

   如果是数组，则覆盖数组的7个变更方法实现变更通知

   ```js
   const arrayProto = Array.prototype
   const arrayMethods = Object.create(arrayProto)
   
   ;['push','pop','shift','unshift','splice','sort','reverse']
     .forEach(function (method) {
     const original = arrayProto[method]
     def(arrayMethods, method, function mutator (...args) {
       const result = original.apply(this, args)
       notify()
       return result
     })
   })
   ```

   

2. 可以看到vue2中有几个问题：

   - 初始化时需要遍历对象所有key，如果对象层级较深，性能不好
   - 通知更新过程需要维护大量dep实例和watcher实例，额外占用内存较多
   - 动态新增、删除对象属性无法拦截，只能用特定set/delete api代替
   - 不支持新的Map、Set等数据结构

   

3. vue3中为了解决以上问题，使用原生的Proxy代替：

   ```js
   function defineReactive(obj) {
     return new Proxy(obj, {
       get(target, key) {
         track(target, key)
         return Reflect.get(target, key)
       },
       set(target, key, val) {
         Reflect.set(target, key, val)
         trigger(target, key)
       },
       deleteProperty(target, key) {
         Reflect.deleteProperty(target, key)
         trigger(target, key)
       }
     })
   }
   ```

   可以同时支持object和array，动态属性增、删都可以拦截，新增数据结构均支持，对象嵌套属性运行时递归，用到才代理，也不需要维护特别多的依赖关系，性能取得很大进步。



**[面试题剖析](https://github.com/57code/vue-interview)**