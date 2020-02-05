const Koa = require('koa')
const mongoose = require('mongoose')
const app = new Koa()
const views = require('koa-views')
const { resolve } = require('path')
const { connect, initSchemas, initAdmin } = require('./database/init')
const R = require('ramda')
const MIDDLEWARES = ['database', 'general', 'router', 'parcel']

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
  initAdmin()

  // require('./tasks/movie')
  // require('./tasks/api')
  // require('./tasks/trailer')
  // require('./tasks/qiniu')
  await useMiddlewares(app)
  app.listen(2233) 
})()