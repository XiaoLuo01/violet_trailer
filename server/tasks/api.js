/**
 * 这里是通过豆瓣api请求到的数据
 */

const rp = require('request-promise-native')   // nodejs 中间层请求后端的服务
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

async function  fetchMovie(item) {
  const url = `http://api.douban.com/v2/movie/${item.doubanId}?apikey=0df993c66c0c636e29ecbb5344252a4a`

  let res = await rp(url)

  try {
    res = JSON.parse(res)
  } catch (err) {
    console.log(err)
  }
  return res
}

;(async () => {
  let movies =await Movie.find({
    $or: [
      { summary: { $exists: false } },
      { summary: null },
      { title: '' },
      { year: { $exists: false } },
      { summary: '' }
    ]
  })

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i]
    let movieData = await fetchMovie(movie)

    if (movieData) {
      let tags = movieData.tags || []

      movie.tags = []
      movie.summary = movieData.summary
      movie.title = movieData.alt_title || movieData.title || ''
      movie.rawTitle = movieData.title || ''

      if (movieData.attrs) {
        movie.movieTypes = movieData.attrs.movie_type || []
        movie.year = movieData.attrs.year[0] || '未知'

        for (let i = 0; i < movie.movieTypes.length; i++) {
          let item = movie.movieTypes[i]
          let cat = await Category.findOne({
            name: item
          })
  
          if (!cat) {
            cat = new Category({
              name: item,
              movies: [movie._id]
            })
          } else {
            if (cat.movies.indexOf(movie._id) === -1) {
              cat.movies.push(movie._id)
            }
          }
          await cat.save()

          if (!movie.category) {
            movie.category.push(cat._id)
          } else {
            if (movie.category.indexOf(cat._id) === -1) {
              movie.category.push(cat._id)
            }
          }
        }

        let datas = movieData.attrs.pubdate || []
        let pubdates = []
        datas.map((item) => {
          if (item && item.split('(').length > 0) {
            let parts = item.split('(')
            let date = parts[0]
            let country = '未知'

            if (parts[1]) {
              country = parts[1].split(")")[0]
            }

            pubdates.push({
              date: new Date(date),
              country
            })
          }
        })

        movie.pubdate = pubdates
      }

      tags.forEach(tag => {
        movie.tags.push(tag.name)
      });
      await movie.save()
    }
  }

})()