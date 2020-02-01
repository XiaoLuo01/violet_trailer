const { controller, get, post, put } = require('../decorator/router')
const { checkPassword } = require('../service/user')

@controller('/api/v0/movies')
export class userController {
  @post('/')
  async login(ctx, next) {
    const { email, password } = ctx.query
    const matchData = await checkPassword(email, password)

    if (!matchData.user) {
      return (ctx.body = {
        success: false,
        err: '用户不存在或者密码不正常'
      })
    }

    if (matchData.match) {
      return (ctx.body = {
        success: true
      })
    }

    return (ctx.body = {
      success: false,
      err: '用户不存在或者密码不正常'
    })
  }
}