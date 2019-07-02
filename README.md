# yyfblog

# create a new repository on the command line

```
echo "# yyfblog" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/yangyufeng96/yyfblog.git
git push -u origin master
```
# push an existing repository from the command line
```
git remote add origin https://github.com/yangyufeng96/yyfblog.git
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
  repo: https://github.com/yangyufeng96/yyfblog.git
  branch: master
  message: update
```
## 上线
```
npm run build
```