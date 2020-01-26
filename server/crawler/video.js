const puppeteer = require('puppeteer')

const base = `https://movie.douban.com/subject/`
const doubanId = `30306570`
const videoBase = `https://movie.douban.com/trailer/256730`

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
  await page.goto(base + doubanId, {
    waitUntil: 'networkidle2'  // 只有2个网络连接时触发
  })

  // 等待三秒钟
  await sleep(1000)

  const result = await page.evaluate(() => {
    var $ = window.$
    var it = $('.related-pic-video')
    if (it && it.length > 0) {
      var link = it.attr('href')
      var cover = it.prop("style").backgroundImage.replace('url("','').replace('?")','')

      return {
        link,
        cover
      }
    }

    return {}
  })

  let video 
  if (result.link) {
    await page.goto(result.link, {
      waitUntil: 'networkidle2'
    })
    await sleep(2000)

    video = await page.evaluate(() => {
      var $ = window.$
      var it = $('source')

      if(it && it.length > 0) {
        return it.attr('src')
      }
      return ''
    })
  }

  const data = {
    video,
    doubanId,
    cover: result.cover
  }

  browser.close()

  process.send(data)
  process.exit(0)
})()