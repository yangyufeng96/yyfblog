var process = require('child_process');
console.log('开始部署.......')
var timer = setInterval(() => {
  console.log(new Date() + '部署中请稍后.......')
}, 1000);
process.exec('hexo clean && hexo d', function (error, stdout, stderr) {
  clearInterval(timer)
  if (error !== null) {
    console.log('exec error: ' + error);
  } else {
    console.log('部署完成.......')
  }
})