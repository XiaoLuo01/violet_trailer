const Koa = require('koa')
const mongoose = require('mongoose')
const app = new Koa()
const views = require('koa-views')
const { resolve } = require('path')
const { connect, initSchemas } = require('./database/init')
const router = require('./routes/index')

;(async () => {
  await connect()

  initSchemas()

  // require('./tasks/api')
})()

app.use(router.routes())
  // .use(router.allowedMethods())

// 静态资源文件加载
app.use(views(resolve(__dirname, './views'), {
  extension: 'pug'
}))

app.use(async (ctx, next) => {
  await ctx.render('index', {
    you: 'Ethon',
    me: 'Carol'
  })
})

app.listen(2233) 