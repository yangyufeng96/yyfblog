# 我的博客系统

# 在命令行上创建一个新的存储库

```
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/yf-feng/yangyufeng_blog.git
git push -u origin master
```
# 从命令行推送现有存储库
```
git remote add origin https://github.com/yf-feng/yangyufeng_blog.git
git push -u origin master
```

# 启动
```
npm run dev
```
# 部署

## 配置项
```
deploy:
- type: git
  repo: https://github.com/yf-feng/yangyufeng_blog.git
  branch: master
  message: update
```
## 上线
```
npm run build
```

## 外部资源jsdelivr CDN托管

### jsDelivr 为开发者提供免费公共 CDN 加速服务

<a href="https://blog.csdn.net/larpland/article/details/101349605">jsDelivr 为开发者提供免费公共 CDN 加速服务</a>

```
如果我把主题托管到github，那么在我的github中也会有这一个文件：

https://github.com/mygitname/mywebsite/tree/master/static/css/style.css

```

### 静态文件托管git地址

<a href="https://github.com/yf-feng/assets_source">静态文件托管git地址</a>

### 图床使用地址

<a href="https://imgchr.com/">https://imgchr.com/</a>

```
用户：yangyufeng0423@163.com