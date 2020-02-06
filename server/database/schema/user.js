/**
 * 登录数据模型
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed  // 一个啥都可以放的 SchemaType
const bcrypt = require('bcryptjs')  // 引入bcrypt模块
const SALT_WORK_FACTOR = 10 // 定义加密密码计算强度
const MAX_LOGIN_ATTEMPTS = 5  // 最大登录失败尝试连接次数
const LOCK_TIME = 2 * 60 * 60 * 1000 // 锁定时间

const userSchema = new Schema({
  role: {
    type: String,
    default: 'user'
  },
  username: {
    unique: true,  // 设置字段唯一
    required: true,
    type: String
  }, 
  email: {
    unique: true,
    required: true,
    type: String
  }, 
  password: {
    unique: true,
    required: true,
    type: String
  }, 
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  lockUntil: Number,

  meta: {
    createdAt: { // 数据被创建的时间
      type: Date,
      default: Date.now()
    },
    updatedAt: { // 数据被更新的时间
      type: Date,
      default: Date.now()
    }
  }
})

// 添加一个虚拟字段, 不会存到数据库中
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

userSchema.pre('save', function (next) {
  // 判断是不是新数据
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})


//使用 pre中间件在用户信息存储前进行密码加密
userSchema.pre('save', function (next) {
  let user = this
  if(!user.isModified('password')) return next()

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) return next(error)

      user.password = hash
      next()
    })
  })
})

// 实例方法
userSchema.methods = {
  // 对比密码
  comparePassword: (_password, password) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password).then((res) => {
        resolve(res)
      })
    })
  },
  // 判断用户是否超过了登录次数进行锁定
  incLoginAttepts: (user) => {
    return new Promise((resolve, reject) => {
      // 过了锁定的有效期
      if (this.lockUntil && this.lockUntil < Date.now()) {
        // 更新操作符
        this.update({
          $set: { // 设置字段值
            loginAttempts: 1
          },
          $unset: { // 删除指定字段
            lockUntil: 1
          }
        }, (err) => {
          if (!err)  resolve(true)
          else reject(err)
        })
      } else {
        let updates = {
          $inc: {
            loginAttempts: 1
          }
        }

        // 当前用户还没有被锁定, 同时尝试次数超过了规定的次数
        if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
          updates.$set = {
            lockUntil: Date.now() + LOCK_TIME
          }
        }

        this.update(updates, err => {
          if (!err) resolve(true)
          else reject(err)
        })
      }
    })
  }

}

// 创建模型
mongoose.model('User', userSchema)