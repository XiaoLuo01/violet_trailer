const Koa = require('koa')
const app = new Koa()
const { htmlTpl, ejsTpl, pugTpl } = require('./template')
// const ejs = require('ejs')
const pug = require('pug')

app.use(async (ctx, next) => {
  ctx.type = 'text/html; charset=utf-8'
  ctx.body = pug.render(pugTpl, {
    you: 'Ethon',
    me: 'Carol'
  })
})

app.listen(2233) 