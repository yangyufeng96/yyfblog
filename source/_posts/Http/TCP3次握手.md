---
type: blog
title: TCP3次握手
categories:
  - Http
abbrlink: 6a5e2f06
date: 2020-9-9 18:17:00
---

## [什么是http?](https://baike.baidu.com/item/%E4%B8%89%E6%AC%A1%E6%8F%A1%E6%89%8B)

为了提供可靠的传送，TCP在发送新的[数据](https://baike.baidu.com/item/数据)之前，以特定的顺序将数据包的序号，并需要这些包传送给目标机之后的确认消息。TCP总是用来发送大批量的[数据](https://baike.baidu.com/item/数据)。当[应用程序](https://baike.baidu.com/item/应用程序)在收到[数据](https://baike.baidu.com/item/数据)后要做出确认时也要用到TCP。

过程

第一次

第一次握手：建立连接时，[客户端](https://baike.baidu.com/item/客户端)发送[syn](https://baike.baidu.com/item/syn)包（syn=j）到[服务器](https://baike.baidu.com/item/服务器)，并进入[SYN_SENT](https://baike.baidu.com/item/SYN_SENT)状态，等待服务器确认；SYN：同步序列编号（Synchronize Sequence Numbers）。

第二次

[第二次握手](https://baike.baidu.com/item/第二次握手)：[服务器](https://baike.baidu.com/item/服务器)收到[syn](https://baike.baidu.com/item/syn)包，必须确认客户的SYN（[ack](https://baike.baidu.com/item/ack)=j+1），同时自己也发送一个SYN包（syn=k），即SYN+ACK包，此时服务器进入[SYN_RECV](https://baike.baidu.com/item/SYN_RECV)状态；

第三次

第三次握手：[客户端](https://baike.baidu.com/item/客户端)收到[服务](https://baike.baidu.com/item/服务)器的SYN+ACK包，向[服务器](https://baike.baidu.com/item/服务器)发送确认包ACK([ack](https://baike.baidu.com/item/ack)=k+1），此包发送完毕，客户端和服务器进入[ESTABLISHED](https://baike.baidu.com/item/ESTABLISHED)（TCP连接成功）状态，完成三次握手。