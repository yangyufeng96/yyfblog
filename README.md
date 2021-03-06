## 项目构建

### 1、在命令行上创建一个新的存储库

```
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/yangyfeng/yangyfeng.github.io.git
git push -u origin master
```
### 2、从命令行推送现有存储库

```
git remote add origin https://github.com/yangyfeng/yangyfeng.github.io.git
git push -u origin master
```

### 3、本地启动项目

```
npm run dev
```
### 4、部署到线上，github托管

**_config.yml 配置项**

```
deploy:
- type: git
  repo: https://github.com/yangyfeng/yangyfeng.github.io.git
  branch: master
  message: update
```
### 5、一键打包上线

```
npm run build
```

###  6、外部资源jsdelivr CDN托管

<a href="https://blog.csdn.net/larpland/article/details/101349605">**jsDelivr 为开发者提供免费公共 CDN 加速服务**</a>

```
如果我把主题托管到github，那么在我的github中也会有这一个文件：
https://github.com/mygitname/mywebsite/tree/master/static/css/style.css
```

### 7、图床使用地址

**图床地址** <a href="https://imgchr.com/">https://imgchr.com/</a>

```
用户：yangyufeng.web@foxmail.com
```

## 文章分类

- 个人项目
- 前端
- 后端
- 深入前端
- 博客文档
- 开发工具

## 标签

专业名词用驼峰命名法 Es6 不是 es6