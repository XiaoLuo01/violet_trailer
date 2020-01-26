const qiniu = require('qiniu')
const nanoid = require('nanoid')
const config = require('../config')

const bucket = config.qiniu.bucket
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)
const cfg = new qiniu.conf.Config()
const client = new qiniu.rs.BucketManager(mac, cfg)

const uploadToQiniu = async (url, key) => {
  return new Promise((resolve, reject) => {
    client.fetch(url, bucket, key, (err, ret, info) => {
      if (err) {
        reject(err)
      } else {
        if( info.statusCode === 200) {
          resolve({ key })
        } else {
          reject(info)
        }
      }
    })
  })
}

;(async () => {
  let movies = [{ 
    video: 'http://vt1.doubanio.com/202001261940/139fc1ebec8ad99929c586c6e74f2f46/view/movie/M/402570160.mp4',
    doubanId: '30306570',
    poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2581835383.jpg',
    cover: 'https://img3.doubanio.com/img/trailer/medium/2578231863.jpg' 
  }]

  movies.map(async movie => {
    if (movie.video && !movie.videoKey) {
      try {
        console.log('开始上传')
        let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4')
        let coverData = await uploadToQiniu(movie.cover, nanoid() + '.png')
        let posterData = await uploadToQiniu(movie.poster, nanoid() + '.png')

        if (videoData.key) {
          movie.videoKey = videoData.key
        }
        if (coverData.key) {
          movie.coverKey = coverData.key
        }
        if (posterData.key) {
          movie.posterKey = posterData.key
        }

        console.log(movie)
        // await movie.save()
      } catch (err) {
        console.log(err)
      }
    }
  })
})()