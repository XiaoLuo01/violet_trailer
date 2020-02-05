const { controller, get, post, put } = require('../decorator/router')
const { checkPassword } = require('../service/user')

@controller('/admin')
export class userController {
  @post('/login')
  async login(ctx, next) {
    const { email, password } = ctx.request.body
    const matchData = await checkPassword(email, password)
    console.log(matchData)

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