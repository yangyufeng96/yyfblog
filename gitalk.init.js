const request = require("request");
const fs = require("fs");
const path = require("path");
const url = require("url");
const xmlParser = require("xml-parser");
const YAML = require("yamljs");
const cheerio = require("cheerio");
// 获取网站配置
const websiteConfig = YAML.parse(fs.readFileSync(path.resolve(__dirname, "./_config.yml"), "utf8"));
// 根据自己的情况进行配置
const config = {
  // GitHub 用户名
  username: "yangyfeng",
  // GitHub Token
  token: "f2b57a04eb80228fcdd44ee22d01be12faf0b912",
  // 存放 issues的git仓库
  repo: "yangyfeng.github.io",
  // sitemap.xml的路径，commit.js放置在根目录下，无需修改，其他情况自行处理
  sitemapUrl: path.resolve(__dirname, `./${websiteConfig.public_dir}/sitemap.xml`),
  // "Gitalk" or "Gitment"
  kind: "Gitalk",
};
let issuesUrl = `https://api.github.com/repos/${config.username}/${config.repo}/issues?access_token=${config.token}`;
let requestGetOpt = {
  method: "GET",
  url: `${issuesUrl}&page=1&per_page=100&state=all`,
  json: true,
  headers: {
    "User-Agent": "github-user",
    accept: "application/vnd.github.v3+json"
  }
};
let requestPostOpt = {
  ...requestGetOpt,
  url: issuesUrl,
  method: "POST",
  form: ""
};
console.log("开始初始化评论...");
(async function () {
  console.log("开始检索链接，请稍等...");
  try {
    let urls = sitemapXmlReader(config.sitemapUrl);
    console.log(`共检索到${urls.length}个链接`);
    console.log("开始获取已经初始化的issues...");
    const issues = await send(requestGetOpt);
    debugger
    if (issues.length) {
      console.log(`已经存在${issues.length}个issues`)
    } else {
      console.log('issues个数未知')
    }
    // 获取的所有链接
    let links = urls.filter((link) => {
      return !issues.find((item) => {
        link = removeProtocol(link);
        return item.body.includes(link);
      });
    });
    // 排除不需要初始化的链接
    // 文章标签页： /blogpost/tags/index.html
    // 文章分类页： /blogpost/categories/index.html 
    // 文章归档页： /blogpost/archives/index.html 
    // 404页：/404.html
    const filterPages = [
      '/blogpost/tags/index.html',
      '/blogpost/categories/index.html',
      '/blogpost/archives/index.html',
      '/404.html'
    ]
    // 链接的头部
    const headUrl = `https://${config.username}.github.io/${config.repo}`
    console.log('过滤不需要初始化的链接：', filterPages)
    // 过滤后的需要初始化的链接
    let notInitIssueLinks = []
    for (let index = 0; index < links.length; index++) {
      let url = links[index];
      let smallUrl = url.replace(headUrl, '')
      if (!filterPages.includes(smallUrl)) {
        notInitIssueLinks.push(url)
      }
    }
    console.log('开始初始化issue...')
    if (notInitIssueLinks.length === 0) {
      console.log("本次发布无新增页面，无需初始化issue!!");
      return
    }
    console.log(`本次有${notInitIssueLinks.length}个链接需要初始化issue：`, notInitIssueLinks);
    notInitIssueLinks.forEach(async (item) => {
      let html = await send({
        ...requestGetOpt,
        url: item
      });
      let title = cheerio.load(html)("title").text();
      let pathLabel = url.parse(item).path;
      let body = `${item}<br><br>${websiteConfig.description}`;
      let form = JSON.stringify({
        body,
        labels: [config.kind, pathLabel],
        title
      });
      send({
        ...requestPostOpt,
        form
      })
    });
    console.log("可以愉快的发表评论了！");
  } catch (e) {
    console.log('检索失败')
  }
})();

function sitemapXmlReader(file) {
  let data = fs.readFileSync(file, "utf8");
  let sitemap = xmlParser(data);
  return sitemap.root.children.map(function (url) {
    let loc = url.children.filter(function (item) {
      return item.name === "loc";
    })[0];
    return loc.content;
  });
}

function removeProtocol(url) {
  return url.substr(url.indexOf(":"));
}

function send(options) {
  return new Promise(function (resolve, reject) {
    request(options, function (error, response, body) {
      if (!error) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}