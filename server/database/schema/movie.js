/**
 * 电影数据模型
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed  // 一个啥都可以放的 SchemaType

const movieSchema = new Schema({
  doubanId: String,  // 豆瓣id
  rate: Number,  // 评分
  title: String, // 标题
  summary: String, // 简介
  video: String,  // 预告片视频地址
  poster: String,  // 海报图地址
  cover: String,  // 预告片封面图地址
  rawTitle: String, // 原始标题
  movieTypes: [String], // 电影类型
  pubdate: Mixed,  // 上映日期
  year: Number,  // 上映年份
  tags: [String],  // 标签

  videoKey: String,  // 图床上的Key
  posterKey: String,
  coverKey: String,

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

// 创建模型
mongoose.model('Moive', movieSchema)