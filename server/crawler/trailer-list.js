const puppeteer = require('puppeteer')

const url = `https://movie.douban.com/tag/#/?sort=R&range=6,10&tags=`

const  sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

;(async () => {
  console.log('Start visit the target page')

  // 创建一个浏览器
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'], //禁止沙箱模式
  })

  // 打开一个新页面
  const page = await browser.newPage()
  await page.goto(url, {
    waitUntil: 'networkidle2'  // 只有2个网络连接时触发
  })

  // 等待三秒钟
  await sleep(3000)

  // 等待加载更多数据的按钮出现
  await page.waitForSelector('.more')

  for (let i = 0; i < 1; i++) {
    await sleep(3000)
    await page.click('.more')  // 点击按钮一次, 获取第二页的数据
  }

  const result = await page.evaluate(() => {
    var $ = window.$
    var items = $('.list-wp a')
    var links = []

    if (items.length >= 1) {
      items.each((index, item) => {
        let it = $(item)
        let doubanId = it.find('div').data('id') 
        let title = it.find('.title').text()
        let rate = Number(it.find('.rate').text())
        let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio')

        links.push({
          doubanId,
          title,
          rate,
          poster
        })
      })
    }

    return links
  })

  browser.close()

  process.send({result})
  process.exit(0)
})()