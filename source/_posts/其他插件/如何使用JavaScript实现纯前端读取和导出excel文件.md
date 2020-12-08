---
type: blog
title: 如何使用JavaScript实现纯前端读取和导出excel文件
tags:
  - excel
categories: 插件
abbrlink: ce0a6a78
date: 2020-12-08
---

# 1、js-xlsx 介绍
`由SheetJS出品的js-xlsx是一款非常方便的只需要纯JS即可读取和导出excel的工具库，功能强大，支持格式众多，支持xls、xlsx、ods(一种OpenOffice专有表格文件格式)等十几种格式。本文全部都是以xlsx格式为例。`

- 官方github：https://github.com/SheetJS/js-xlsx
- 本文配套demo在线演示地址：http://demo.haoji.me/2017/02/08-js-xlsx/

<!-- more -->

## 1.1 兼容性

[![rS2F8P.png](https://s3.ax1x.com/2020/12/08/rS2F8P.png)](https://imgchr.com/i/rS2F8P)

## 1.2. 如何使用

`dist`目录下有很多个JS文件，一般情况下用`xlsx.core.min.js`就够了，`xlsx.full.min.js`则是包含了所有功能模块。

[![rS2K5n.png](https://s3.ax1x.com/2020/12/08/rS2K5n.png)](https://imgchr.com/i/rS2K5n)

`<script type="text/javascript" src="./js/xlsx.core.min.js"></script>`

# 2、读取excel

读取excel主要是通过`XLSX.read(data, {type: type});`方法来实现，返回一个叫WorkBook的对象，type主要取值如下：

- base64: 以base64方式读取；
- binary: BinaryString格式(byte n is data.charCodeAt(n))
- string: UTF8编码的字符串；
- buffer: nodejs Buffer；
- array: Uint8Array，8位无符号数组；
- file: 文件的路径（仅nodejs下支持）；

## 2.1 获取workbook对象

**读取本地文件**

```
// 读取本地excel文件
function readWorkbookFromLocalFile(file, callback) {
	var reader = new FileReader();
	reader.onload = function(e) {
		var data = e.target.result;
		var workbook = XLSX.read(data, {type: 'binary'});
		if(callback) callback(workbook);
	};
	reader.readAsBinaryString(file);
}
```

**读取网络文件**

```
// 从网络上读取某个excel文件，url必须同域，否则报错
function readWorkbookFromRemoteFile(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('get', url, true);
	xhr.responseType = 'arraybuffer';
	xhr.onload = function(e) {
		if(xhr.status == 200) {
			var data = new Uint8Array(xhr.response)
			var workbook = XLSX.read(data, {type: 'array'});
			if(callback) callback(workbook);
		}
	};
	xhr.send();
}
```

**读取workbook**

```
// 读取 excel文件
function outputWorkbook(workbook) {
	var sheetNames = workbook.SheetNames; // 工作表名称集合
	sheetNames.forEach(name => {
		var worksheet = workbook.Sheets[name]; // 只能通过工作表名称来获取指定工作表
		for(var key in worksheet) {
			// v是读取单元格的原始值
			console.log(key, key[0] === '!' ? worksheet[key] : worksheet[key].v);
		}
	});
}
```
根据!ref确定excel的范围，再根据!merges确定单元格合并（如果有），最后输出整个table，比较麻烦，幸运的是，插件自身已经写好工具类XLSX.utils给我们直接使用，无需我们自己遍历，工具类输出主要包括如下：

[![rSRFo9.png](https://s3.ax1x.com/2020/12/08/rSRFo9.png)](https://imgchr.com/i/rSRFo9)

有些不常用，常用的主要是：

- XLSX.utils.sheet_to_csv：生成CSV格式
- XLSX.utils.sheet_to_txt：生成纯文本格式
- XLSX.utils.sheet_to_html：生成HTML格式
- XLSX.utils.sheet_to_json：输出JSON格式

常用的主要是sheet_to_csv或者sheet_to_html，转csv的话会忽略格式、单元格合并等信息，所以复杂表格可能不适用。转html的话会保留单元格合并，但是生成的是<html></html>代码，而不是<table></table>，需要对表格进行一些定制时不太方便，所以具体还是要视情况来采用合适的工具类。

这里写一个采用转csv方式输出结果的简单示例，可点击这里查看[在线DEMO](http://demo.haoji.me/2017/02/08-js-xlsx/)：

```
var csv = XLSX.utils.sheet_to_csv(worksheet);
	document.getElementById('result').innerHTML = csv2table(csv);
}

// 将csv转换成简单的表格，会忽略单元格合并，在第一行和第一列追加类似excel的索引
function csv2table(csv)
{
	var html = '<table>';
	var rows = csv.split('\n');
	rows.pop(); // 最后一行没用的
	rows.forEach(function(row, idx) {
		var columns = row.split(',');
		columns.unshift(idx+1); // 添加行索引
		if(idx == 0) { // 添加列索引
			html += '<tr>';
			for(var i=0; i<columns.length; i++) {
				html += '<th>' + (i==0?'':String.fromCharCode(65+i-1)) + '</th>';
			}
			html += '</tr>';
		}
		html += '<tr>';
		columns.forEach(function(column) {
			html += '<td>'+column+'</td>';
		});
		html += '</tr>';
	});
	html += '</table>';
	return html;
}
```

# 导出excel

导出分为2种，一种是基于现有excel修改，一种是全新生成，前者比较简单，我们这里着重讲后者。

**自己手写代码生成**

导出excel文件，主要是如何生成一个sheet，我们这里写一个最简单的csv转excel示例

```
// csv转sheet对象
function csv2sheet(csv) {
	var sheet = {}; // 将要生成的sheet
	csv = csv.split('\n');
	csv.forEach(function(row, i) {
		row = row.split(',');
		if(i == 0) sheet['!ref'] = 'A1:'+String.fromCharCode(65+row.length-1)+(csv.length-1);
		row.forEach(function(col, j) {
			sheet[String.fromCharCode(65+j)+(i+1)] = {v: col};
		});
	});
	return sheet;
}

// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
function sheet2blob(sheet, sheetName) {
	sheetName = sheetName || 'sheet1';
	var workbook = {
		SheetNames: [sheetName],
		Sheets: {}
	};
	workbook.Sheets[sheetName] = sheet;
	// 生成excel的配置项
	var wopts = {
		bookType: 'xlsx', // 要生成的文件类型
		bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
		type: 'binary'
	};
	var wbout = XLSX.write(workbook, wopts);
	var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
	// 字符串转ArrayBuffer
	function s2ab(s) {
		var buf = new ArrayBuffer(s.length);
		var view = new Uint8Array(buf);
		for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
		return buf;
	}
	return blob;
}
```
拿到上面的blob对象就可以直接下载了，参考我之前在[JS弹出下载对话框](http://blog.haoji.me/js-download.html#JS-dan-chu-xia-zai-dui-hua-kuang)里面封装好的openDownloadDialog方法：

```
/**
 * 通用的打开下载对话框方法，没有测试过具体兼容性
 * @param url 下载地址，也可以是一个blob对象，必选
 * @param saveName 保存文件名，可选
 */
function openDownloadDialog(url, saveName)
{
	if(typeof url == 'object' && url instanceof Blob)
	{
		url = URL.createObjectURL(url); // 创建blob地址
	}
	var aLink = document.createElement('a');
	aLink.href = url;
	aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
	var event;
	if(window.MouseEvent) event = new MouseEvent('click');
	else
	{
		event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	}
	aLink.dispatchEvent(event);
}

```
所以，最终下载实现如下：

```
// 传入csv，执行后就会弹出下载框
function exportExcel(csv) {
	var sheet = csv2sheet(csv);
	var blob = sheet2blob(sheet);
	openDownloadDialog(blob, '导出.xlsx')；
}
```

**处理单元格合并**

一般来说，前端生成excel而不是csv最主要目的都是为了解决csv不能实现单元格合并的问题，要不然直接导出csv文件就好了，何必引入几百kb的插件

```
var aoa = [
	['主要信息', null, null, '其它信息'], // 特别注意合并的地方后面预留2个null
	['姓名', '性别', '年龄', '注册时间'],
	['张三', '男', 18, new Date()],
	['李四', '女', 22, new Date()]
];
var sheet = XLSX.utils.aoa_to_sheet(aoa);
sheet['!merges'] = [
	// 设置A1-C1的单元格合并
    {s: {r: 0, c: 0}, e: {r: 0, c: 2}}
];
openDownloadDialog(sheet2blob(sheet), '单元格合并示例.xlsx');
```
需要注意的地方就是被合并的单元格要用null预留出位置，否则后面的内容（本例中是第四列其它信息）会被覆盖。

| 原文地址：https://www.cnblogs.com/liuxianan/p/js-excel.html
