/**
 * 电影分类数据模型
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId  // 一个啥都可以放的 SchemaType

const categorySchema = new Schema({
  name: {
    unique: true,
    type: String
  },
  movies: [{
    type: ObjectId,
    ref: 'Movie'
  }],
  
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

categorySchema.pre('save', function (next) {
  // 判断是不是新数据
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

// 创建模型
mongoose.model('Category', categorySchema)