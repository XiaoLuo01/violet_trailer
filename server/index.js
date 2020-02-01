const Koa = require('koa')
const mongoose = require('mongoose')
const app = new Koa()
const views = require('koa-views')
const { resolve } = require('path')
const { connect, initSchemas } = require('./database/init')
const R = require('ramda')
const MIDDLEWARES = ['router', 'parcel']

const useMiddlewares = (app) => {
  R.map(R.compose(
    R.forEachObjIndexed(
      initWith => initWith(app)
    ),
    require,
    name => resolve(__dirname, `./middleware/${name}`)
  ))(MIDDLEWARES)
}

;(async () => {
  await connect()

  initSchemas()

  // require('./tasks/api')
  await useMiddlewares(app)
  app.listen(2233) 
})()