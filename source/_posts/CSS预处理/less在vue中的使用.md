---
type: blog
title: less在vue中的使用
categories: 
  - 前端
tags:
  - Less
  - Vue
abbrlink: 8136685c
date: 2020-9-8 00:00:00
---

# less在vue中的使用

首先vue环境搭建成功

## 第一步：

**安装 less 和less-loader**

``` 
安装less依赖：npm install less less-loader --save
```

## 第二步：

**修改webpack.base.config.js文件，配置loader加载依赖，让其支持外部的less,在原来的代码上添加**

```
// 此种方法在控制台中标签样式显示的是style标签样式
{ 
    test: /\.less$/,

    loader: "style-loader!css-loader!less-loader",

},
```

```
// 可以在控制台中看到当前标签样式来自于哪个less文件
{ 
    test: /\.less$/,

    loader: "style-loader!css-loader!less-loader",
　　　　 options: { sourceMap: true }
}
```

![](https://img2018.cnblogs.com/blog/1281517/201902/1281517-20190220094624448-2102626446.png)



## 第三步：

**在vue文件中的style标签中添加lang="less"即可在标签中使用less，或者外部引入less**

![](https://img2018.cnblogs.com/blog/1281517/201902/1281517-20190220095032656-1323519047.png)