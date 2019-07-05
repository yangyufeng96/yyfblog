const process = require('child_process');
const ora = require('ora')
const chalk = require('chalk')
const spinner = ora({
  text: '正在部署......'
})
spinner.start()
process.exec('hexo clean && hexo d', function (error, stdout, stderr) {
  spinner.stop()
  if (error !== null) {
    console.log(chalk.red('部署失败，请重试！ \n'))
  } else {
    console.log(chalk.cyan(
      '部署成功！ \n\n' + 
      'Your application is running here: https://yangyufeng96.github.io/yyfblog/ \n\n'
    ))
    console.log(chalk.yellow(
      '提示：构建的文件应通过HTTP服务器提供。 \n\n' +
      '通过"file://"方式打开index.html文件可能无法工作。 \n\n'
    ))
  }
})