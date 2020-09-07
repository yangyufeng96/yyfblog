---
type: blog
title: git子目录创建分支
tags: git
categories: Git
abbrlink: 2bdc4097
date: 2019-07-13 14:01:41
---

**使用场景**

例如，在项目Game中有一个子目录AI。Game和AI分别是一个独立的git项目，可以分开维护。为了避免直接复制粘贴代码，我们希望Game中的AI子目录与AI的git项目关联，有3层意思：

1.AI子目录使用AI的git项目来填充，内容保持一致。

2.当AI的git项目代码有更新，可以拉取更新到Game项目的AI子目录来。

3.反过来，当Game项目的AI子目录有变更，还可以推送这些变更到AI的git项目。

用git subtree可以轻松满足上面的需求。

<!-- more -->

# **git subtree用法**

## **1. 第一次添加子目录，建立与git项目的关联**

建立关联总共有2条命令。

```
语法：git remote add -f <子仓库名> <子仓库地址> 

解释：其中-f意思是在添加远程仓库之后，立即执行fetch。

语法：git subtree add --prefix=<子目录名> <子仓库名> <分支> --squash 

解释：–squash意思是把subtree的改动合并成一次commit，这样就不用拉取子项目完整的历史记录。–prefix之后的=等号也可以用空格。
```
示例
```
git remote add -f ai https://github.com/aoxu/ai.git   
git subtree add --prefix=ai ai master --squash 
```
## **2. 从远程仓库更新子目录**

更新子目录有2条命令。
```
语法：git fetch <远程仓库名> <分支>  
语法：git subtree pull --prefix=<子目录名> <远程分支> <分支> --squash 
```
示例
```
git fetch ai master   
git subtree pull --prefix=ai ai --squash 
```
## **3. 从子目录push到远程仓库（确认你有写权限）**

推送子目录的变更有1条命令。
```
语法：git subtree push --prefix=<子目录名> <远程分支名> 分支 
```
示例
```
git subtree push --prefix=ai ai master
```

**原文地址：**[**http://cssor.com/git-subtree-usage.html**](http://cssor.com/git-subtree-usage.html)

