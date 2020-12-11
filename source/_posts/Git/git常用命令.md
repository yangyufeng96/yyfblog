---
type: blog
title: git常用命令
layout: post
tags: git
categories: 
  - Git
abbrlink: 423abe9e
date: 2019-07-13 13:48:01
---

**推送到远程仓库**：[http://blog.csdn.net/u011043843/article/details/33336625](http://blog.csdn.net/u011043843/article/details/33336625)

**github设置添加SSH**：https://blog.csdn.net/binyao02123202/article/details/20130891

<!-- more -->

## **一.设置git的全局变量(用户名和邮箱)**

```
1. git config --global user.name”用户名(建议是英文)” 创建用户名
2. git config --global user.email”邮箱地址” 创建邮箱
```


## **二.创建一个新的仓库**

```
1. git clone <url>  从远程服务器克隆一个完全一样的版本库到本地 ：
2. git add . 暂存文件
3. git commit -a <注释> 提交
4. git push -u origin master 推送（推送到主分支）
```


## **三.本地已经创建该目录**

```
1. git init .初始化
2. git remote add origin ssh://git.com/lsy/demo.git 增加一个远程服务端 
3. git add 文件名/工程名 .（所有文件） 暂存文件
4. git commit -m “Initial commit” 提交
5. git push -u origin master 推送（推送到主分支）
```


## **四.存在git仓库**

```
1. cd demo 进入该仓库
2. git remote add origin ssh://git.com/lsy/hhh.git（git  pull 同步代码到本地）增加一个远程服务端
3. git push -u origin --all（上传代码到远程库） 推送
4. git push -u origin --tags 推送标签到主机
```


## **五.常用命令：**

```
1. git branch 查看本地所有分支
2. git branch -a 查看远程所有的分支
3. git branch -r 查看远程所有分支(不包括当前分支)
4. git push origin --delete <name>  可以删除远程分支
5. git branch -d <name>  可以删除本地分支（在主分支中）
6. git status 查看当前状态 
7. git commit -am "init" 提交并且加注释 
8. git subtree push --prefix= [目录地址(dist)] origin [分支名称(gh-pages)]  单个目录托管命令
9. git remote add origin git@192.168.1.119:ndshow
10. git push origin master 将文件给推到服务器上 
11. git remote show origin 显示远程库origin里的资源 
12. git push origin master:develop 提交本地master分支作为远程的develop分支
13. git checkout --track origin/dev 切换到远程dev分支
14. git checkout -b dev 建立一个新的本地分支dev
15. git merge origin/dev 将分支dev与当前分支进行合并
16. git checkout dev 切换到本地dev分支
17. git remote show 查看远程库
18. git remote remove <name>  删除remote
19. git add . 暂存文件全部
20. git rm 文件名(包括路径) 从git中删除指定文件
21. git clone git:// 下载
22. github.com/schacon/grit.git 从服务器上将代码给拉下来
23. git config --list 看所有用户
24. git ls-files 看已经被提交的
25. git rm [file name] 删除一个文件
26. git commit -a 提交当前repos的所有的改变
27. git add [file name] 添加一个文件到git index
28. git commit -v 当你用－v参数的时候可以看commit的差异
29. git commit -m "This is the message describing the commit" 添加commit信息
30. git commit -a -a是代表add，把所有的change加到git index里然后再commit
31. git commit -a -v 一般提交命令
32. git log 看你commit的日志
33. git diff 查看尚未暂存的更新
34. git rm a.a 移除文件(从暂存区和工作区中删除)
35. git rm --cached a.a 移除文件(只从暂存区中删除)
36. git commit -m "remove" 移除文件(从Git中删除)
37. git rm -f a.a 强行移除修改后文件(从暂存区和工作区中删除)
38. git diff --cached 或 $ git diff --staged 查看尚未提交的更新
39. git stash push 将文件给push到一个临时空间中
40. git stash pop 将文件从临时空间pop下来
41. git remote add origin git@github.com:username/Hello-World.git
42. git push origin master 将本地项目给提交到服务器中
43. git pull 本地与服务器端同步
44. git push (远程仓库名) (分支名) 将本地分支推送到服务器上去。
45. git push origin serverfix:awesomebranch
46. git fetch 相当于是从远程获取最新版本到本地，不会自动merge
47. git commit -a -m "log_message" (-a是提交所有改动，-m是加入log信息) 本地修改同步至服务器端 ：
48. git branch branch_0.1 master 从主分支master创建branch_0.1分支
49. git branch -m branch_0.1 branch_1.0 将branch_0.1重命名为branch_1.0
50. git checkout branch_1.0/master 切换到branch_1.0/master分支
51. git branch 删除远程branch
52. git push origin :branch_remote_name
53. git branch -r -d branch_remote_name
54. git reset --hard commit_id 版本回退
55. git log可以查看提交历史
56. git reflog查看命令历史
```