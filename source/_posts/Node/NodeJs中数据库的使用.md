---
type: blog
title: NodeJs中数据库的使用
categories:
  - node
tags:
  - node
abbrlink: e4aa7462
date: 2020-09-09 18:29:00
---

## 1.Node.js 连接 MySQL

cnpm install mysql

连接mysql:

```
  var mysql      = require('mysql');
  
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'test'
  });
  
  connection.connect();
    
  connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
  });
```

数据库连接参数说明

```
    参数 描述
    host 主机地址 （默认：localhost）
    
    user 用户名
    
    password 密码
    
    port 端口号 （默认：3306）
    
    database  数据库名
    
    charset  连接字符集（默认：'UTF8_GENERAL_CI'，注意字符集的字母都要大写）
    
    localAddress  此IP用于TCP连接（可选）
    
    socketPath  连接到unix域路径，当使用 host 和 port 时会被忽略
    
    timezone  时区（默认：'local'）
    
    connectTimeout 连接超时（默认：不限制；单位：毫秒）
    
    stringifyObjects 是否序列化对象
    
    typeCast  是否将列值转化为本地JavaScript类型值 （默认：true）
    
    queryFormat  自定义query语句格式化方法
    
    supportBigNumbers  数据库支持bigint或decimal类型列时，需要设此option为true （默认：false）bigNumberStrings supportBigNumbers和bigNumberStrings启用 强制bigint或decimal列以JavaScript字符串类型返回（默认：false）
    
    dateStrings  强制timestamp,datetime,data类型以字符串类型返回，而不是JavaScript Date类型（默认：false）
    
    debug  开启调试（默认：false）
    
    multipleStatements 是否许一个query中有多个MySQL语句 （默认：false）
    
    flags 用于修改连接标志
    
    ssl  使用ssl参数（与crypto.createCredenitals参数格式一至）或一个包含ssl配置文件名称的字符串，目前只捆绑Amazon RDS的配置文件
```


<!-- more -->

2.Node.js 连接 MongoDB：

MongoDB是一种文档导向数据库管理系统，由C++撰写而成。MongoDB 教程。 安装驱动

```
  $ cnpm install mongodb
```

## 增删改查

> 要在 MongoDB 中创建一个数据库，首先我们需要创建一个 MongoClient 对象，然后配置好指定的 URL 和 端口号。
> 如果数据库不存在，MongoDB 将创建数据库并建立连接。

创建连接

```
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/mydb";
    
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("数据库已创建!");
    db.close();
  });
```

创建集合

> 我们可以使用 createCollection() 方法来创建集合： 创建集合

```
  var MongoClient = require('mongodb').MongoClient;
  var url = 'mongodb://localhost:27017/mydb';
  MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      console.log('数据库已创建');
      var dbase = db.db("mydb");
      dbase.createCollection('runoob', function (err, res) {
          if (err) throw err;
          console.log("创建集合!");
          db.close();
      });
  });
```

数据库操作( CURD )

> 与 MySQL 不同的是 MongoDB 会自动创建数据库和集合，所以使用前我们不需要手动去创建。 插入数据 以下实例我们连接数据库

> runoob 的 site 表，并插入两条数据：

插入数据

```
    var MongoClient = require('mongodb').MongoClient;
    var DB_CONN_STR = 'mongodb://localhost:27017/runoob'; # 数据库为 runoob
     
    var insertData = function(db, callback) {  
        //连接到表 site
        var collection = db.collection('site');
        //插入数据
        var data = [{"name":"菜鸟教程","url":"www.runoob.com"},{"name":"菜鸟工具","url":"c.runoob.com"}];
        collection.insert(data, function(err, result) { 
            if(err)
            {
                console.log('Error:'+ err);
                return;
            }     
            callback(result);
        });
    }
     
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        console.log("连接成功！");
        insertData(db, function(result) {
            console.log(result);
            db.close();
        });
    });
```

执行以下命令输出就结果为：

```
    $ node test.js //连接成功！
    
    { result: { ok: 1, n: 2 },
      ops: 
       [ { name: '菜鸟教程',
           url: 'www.runoob.com',
           _id: 58c25e13a08de70d3b9d4116 },
         { name: '菜鸟工具',
           url: 'c.runoob.com',
           _id: 58c25e13a08de70d3b9d4117 } ],
      insertedCount: 2,
      insertedIds: [58c25e13a08de70d3b9d4116, 58c25e13a08de70d3b9d4117]
    }
```

从输出结果来看，数据已插入成功。

我们也可以打开 MongoDB 的客户端查看数据，如：

```
    show dbs
    
    admin   0.000GB
    local   0.000GB
    runoob  0.000GB          # 自动创建了 runoob 数据库
    
    show tables
    site                     # 自动创建了 site 集合（数据表）
    
    db.site.find()         # 查看集合中的数据
    { "_id" : ObjectId("58c25f300cd56e0d7ddfc0c8"), "name" : "菜鸟教程", "url" : "www.runoob.com" }
    { "_id" : ObjectId("58c25f300cd56e0d7ddfc0c9"), "name" : "菜鸟工具", "url" : "c.runoob.com" }
```

查询数据

以下实例检索 name 为 "菜鸟教程" 的实例：

```
    var MongoClient = require('mongodb').MongoClient;
    var DB_CONN_STR = 'mongodb://localhost:27017/runoob';    
     
    var selectData = function(db, callback) {  
      //连接到表  
      var collection = db.collection('site');
      //查询数据
      var whereStr = {"name":'菜鸟教程'};
      collection.find(whereStr).toArray(function(err, result) {
        if(err)
        {
          console.log('Error:'+ err);
          return;
        }     
        callback(result);
      });
    }
     
    MongoClient.connect(DB_CONN_STR, function(err, db) {
      console.log("连接成功！");
      selectData(db, function(result) {
        console.log(result);
        db.close();
      });
    });
```

执行以下命令输出就结果为：

> 连接成功！

```
    [ { _id: 58c25f300cd56e0d7ddfc0c8,
        name: '菜鸟教程',
        url: 'www.runoob.com' } ]
```

更新数据

我们也可以对数据库的数据进行修改，以下实例将 name 为 "菜鸟教程" 的 url 改为 https://www.runoob.com：

```
    var MongoClient = require('mongodb').MongoClient;
    var DB_CONN_STR = 'mongodb://localhost:27017/runoob';    
     
    var updateData = function(db, callback) {  
        //连接到表  
        var collection = db.collection('site');
        //更新数据
        var whereStr = {"name":'菜鸟教程'};
        var updateStr = {$set: { "url" : "https://www.runoob.com" }};
        collection.update(whereStr,updateStr, function(err, result) {
            if(err)
            {
                console.log('Error:'+ err);
                return;
            }     
            callback(result);
        });
    }
     
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        console.log("连接成功！");
        updateData(db, function(result) {
            console.log(result);
            db.close();
        });
    });
```

> 执行成功后，进入 mongo 管理工具查看数据已修改：

```
    db.site.find()
    { "_id" : ObjectId("58c25f300cd56e0d7ddfc0c8"), "name" : "菜鸟教程", "url" : "https://www.runoob.com" }
    { "_id" : ObjectId("58c25f300cd56e0d7ddfc0c9"), "name" : "菜鸟工具", "url" : "c.runoob.com" }
```

删除数据

> 以下实例将 name 为 "菜鸟工具" 的数据删除 :

```
    var MongoClient = require('mongodb').MongoClient;
    var DB_CONN_STR = 'mongodb://localhost:27017/runoob';    
     
    var delData = function(db, callback) {  
      //连接到表  
      var collection = db.collection('site');
      //删除数据
      var whereStr = {"name":'菜鸟工具'};
      collection.remove(whereStr, function(err, result) {
        if(err)
        {
          console.log('Error:'+ err);
          return;
        }     
        callback(result);
      });
    }
     
    MongoClient.connect(DB_CONN_STR, function(err, db) {
      console.log("连接成功！");
      delData(db, function(result) {
        console.log(result);
        db.close();
      });
    });
```

执行成功后，进入 mongo 管理工具查看数据已删除：

```
  db.site.find()
  { "_id" : ObjectId("58c25f300cd56e0d7ddfc0c8"), "name" : "菜鸟教程", "url" : "https://www.runoob.com" }
```
