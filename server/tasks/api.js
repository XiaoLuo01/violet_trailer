const rp = require('request-promise-native')

async function  fetchMovie(item) {
  const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}?apikey=0df993c66c0c636e29ecbb5344252a4a`

  const res = await rp(url)
  return res
}

;(async () => {
  let movies = [{ 
    doubanId: 34906722,
    title: '10的秘密',
    rate: 6.1,
    poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2575952733.jpg' 
  },
  { doubanId: 30329906,
    title: '新世界',
    rate: 7.3,
    poster:
     'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2580047722.jpg' 
  }]

  movies.map(async movie => {
    let movieData = await fetchMovie(movie)

    try {
      movieData = JSON.parse(movieData)
      console.log(movieData.summary)
    } catch (err) {
      console.log(err)
    }
   
  })
})()