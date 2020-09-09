---
type: blog
title: http协议
categories:
  - http
tags:
  - http
abbrlink: 6a5e2f06
date: 2020-9-9 18:20:00
---

**HTTP 简介：**

HTTP是Hyper Text Transfer Protocol（超文本传输协议）的缩写

HTTP是因特网上应用最为广泛的一种网络传输协议，是一个无状态的请求/响应协议

HTTP是基于客户端/服务端（C/S）的架构模型

HTTP是一个基于TCP/IP通信协议来传递数据

HTTP协议通常承载于TCP协议之上，有时也承载于TLS或SSL协议层之上，这个时候，就成了我们常说的HTTPS默认HTTP的端口号为80，HTTPS的端口号为443



**HTTP的请求响应模型：**

HTTP协议永远都是客户端发起请求，服务器回送响应

这样就限制了使用HTTP协议，无法实现在客户端没有发起请求的时候，服务器将消息推送给客户端。

HTTP协议是一个无状态的协议，同一个客户端的这次请求和上次请求是没有对应关系



**HTTP 工作原理：**

HTTP协议工作于客户端-服务端架构上。浏览器作为Http客户端通过地址栏 Url将请求发送到Http服务端即Web服务器上。

Web服务器有：Apache服务器，IIS服务器（Internet Information Services）等



**HTTP三点注意事项：**

HTTP是无连接：无连接的含义是限制每次连接只处理一个请求。服务器处理完客户的请求，并收到客户的应答后，即断开连接。采用这种方式可以节省传输时间。
HTTP是媒体独立的：这意味着，只要客户端和服务器知道如何处理数据内容，任何类型的数据都可以通过HTTP发送。客户端以及服务器指定使用适合的MIME-type内容类型。
HTTP是无状态：HTTP协议是无状态协议。无状态是指协议对于事务处理没有记忆能力。缺少状态意味着如果后续处理需要前面的信息，则它必须重传，这样可能导致每次连接传送的数据量增大。另一方面，在服务器不需要先前信息时它的应答就较快。

**工作流程：**

一次完整的Http事务：http://blog.csdn.net/yipiankongbai/article/details/25029183

一次HTTP操作称为一个事务，其工作过程可分为六步：



域名解析 --> 发起TCP的3次握手 --> 建立TCP连接后发起http请求 --> 服务器响应http请求，浏览器得到html代码 --> 浏览器解析html代码，并请求html代码中的资源（如js、css、图片等） --> 浏览器对页面进行渲染呈现给用户

域名解析 -> 三次握手 -> 建立连接 -> 发送请求 -> 响应请求 -> 接收响应

任何一步发生错误，都会将错误信息返回到客户端



1）域名解析 ：将网站名称转变成IP地址：localhost-->127.0.0.1 2）发起TCP的3次握手 ：

客户端发出一个SYN消息 -》

服务器使用SYN+ACK应答表示接收到了这个消息 -》

客户机再以ACK消息响应 -》

建立起可靠的TCP连接，数据传递

3）客户端与服务端建立连接

4）客户端发送请求给服务端，请求方式的格式为：统一资源标识符（URL）、协议版本号，后边是MIME信息包括请求修饰符、客户机信息和可能的内容。

5）服务端接到请求后，给予相应的响应信息，其格式为一个状态行，包括信息的协议版本号、一个成功或错误的代码，后边是MIME信息包括服务器信息、实体信息和可能的内容。

6）客户端接收服务端所返回的信息通过浏览器显示在用户的显示屏上，然后客户机与服务器断开连接。



**HTTP请求方法：**

HTTP1.0定义了三种请求方法： GET, POST 和 HEAD方法。

HTTP1.1新增了五种请求方法：OPTIONS, PUT, DELETE, TRACE 和 CONNECT 方法。



GET 请求指定的页面信息，并返回实体主体。

HEAD 类似于get请求，只不过返回的响应中没有具体的内容，用于获取报头

POST 向指定资源提交数据进行处理请求（例如提交表单或者上传文件）。数据被包含在请求体中。POST请求可能会导致新的资源的建立和/或已有资源的修改。

PUT 从客户端向服务器传送的数据取代指定的文档的内容。

DELETE 请求服务器删除指定的页面。

CONNECT HTTP/1.1协议中预留给能够将连接改为管道方式的代理服务器。

OPTIONS 允许客户端查看服务器的性能。

TRACE 回显服务器收到的请求，主要用于测试或诊断。



**HTTP 响应头信息：**

HTTP请求头提供了关于请求，响应或者其他的发送实体的信息。

服务器支持哪些请求方法（如GET、POST等）。

Content-Encoding

文档的编码（Encode）方法。只有在解码之后才可以得到Content-Type头指定的内容类型。利用gzip压缩文档能够显著地减少HTML文档的下载时间。Java的GZIPOutputStream可以很方便地进行gzip压缩，但只有Unix上的Netscape和Windows上的IE 4、IE 5才支持它。因此，Servlet应该通过查看Accept-Encoding头（即request.getHeader("Accept-Encoding")）检查浏览器是否支持gzip，为支持gzip的浏览器返回经gzip压缩的HTML页面，为其他浏览器返回普通页面。

Content-Length

表示内容长度。只有当浏览器使用持久HTTP连接时才需要这个数据。如果你想要利用持久连接的优势，可以把输出文档写入 ByteArrayOutputStream，完成后查看其大小，然后把该值放入Content-Length头，最后通过byteArrayStream.writeTo(response.getOutputStream()发送内容。

Content-Type

表示后面的文档属于什么MIME类型。Servlet默认为text/plain，但通常需要显式地指定为text/html。由于经常要设置Content-Type，因此HttpServletResponse提供了一个专用的方法setContentType。

Date

当前的GMT时间。你可以用setDateHeader来设置这个头以避免转换时间格式的麻烦。

Expires

应该在什么时候认为文档已经过期，从而不再缓存它？

Last-Modified

文档的最后改动时间。客户可以通过If-Modified-Since请求头提供一个日期，该请求将被视为一个条件GET，只有改动时间迟于指定时间的文档才会返回，否则返回一个304（Not Modified）状态。Last-Modified也可用setDateHeader方法来设置。

Location

表示客户应当到哪里去提取文档。Location通常不是直接设置的，而是通过HttpServletResponse的sendRedirect方法，该方法同时设置状态代码为302。

Refresh

表示浏览器应该在多少时间之后刷新文档，以秒计。除了刷新当前文档之外，你还可以通过setHeader("Refresh", "5; URL=http://host/path")让浏览器读取指定的页面。 

注意这种功能通常是通过设置HTML页面HEAD区的＜META HTTP-EQUIV="Refresh" CONTENT="5;URL=http://host/path"＞实现，这是因为，自动刷新或重定向对于那些不能使用CGI或Servlet的HTML编写者十分重要。但是，对于Servlet来说，直接设置Refresh头更加方便。 



注意Refresh的意义是"N秒之后刷新本页面或访问指定页面"，而不是"每隔N秒刷新本页面或访问指定页面"。因此，连续刷新要求每次都发送一个Refresh头，而发送204状态代码则可以阻止浏览器继续刷新，不管是使用Refresh头还是＜META HTTP-EQUIV="Refresh" ...＞。 



注意Refresh头不属于HTTP 1.1正式规范的一部分，而是一个扩展，但Netscape和IE都支持它。

Server

服务器名字。Servlet一般不设置这个值，而是由Web服务器自己设置。

Set-Cookie

设置和页面关联的Cookie。Servlet不应使用response.setHeader("Set-Cookie", ...)，而是应使用HttpServletResponse提供的专用方法addCookie。参见下文有关Cookie设置的讨论。

WWW-Authenticate

客户应该在Authorization头中提供什么类型的授权信息？在包含401（Unauthorized）状态行的应答中这个头是必需的。例如，response.setHeader("WWW-Authenticate", "BASIC realm=＼"executives＼"")。 

注意Servlet一般不进行这方面的处理，而是让Web服务器的专门机制来控制受密码保护页面的访问（例如.htaccess）。



**HTTP状态码：**

下面是常见的HTTP状态码：

200 - 请求成功
301 - 资源（网页等）被永久转移到其它URL
404 - 请求的资源（网页等）不存在
500 - 内部服务器错误
HTTP状态码由三个十进制数字组成，第一个十进制数字定义了状态码的类型，后两个数字没有分类的作用。HTTP状态码共分为5种类型：

1** 信息，服务器收到请求，需要请求者继续执行操作

2** 成功，操作被成功接收并处理

3** 重定向，需要进一步的操作以完成请求

4** 客户端错误，请求包含语法错误或无法完成请求

5** 服务器错误，服务器在处理请求的过程中发生了错误

HTTP content-type：http://www.runoob.com/http/http-content-type.html

