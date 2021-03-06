import mongoose from 'mongoose'
const Movie = mongoose.model('Movie')

export const getAllMovies = async (type, year) => {
  let query = {}

  if (type) {
    query.movieTypes = {
      $in: [type]
    }
  }

  if(year) {
    query.year = year
  }

  const movies = await Movie.find(query)

  return movies
}

export const getMovieDetail = async (id) => {
  let movie = await Movie.findOne({_id: id})

  return movie
}

export const getRelativeMovies = async (movie) => {
  let movies = await Movie.find({
    movieTypes: {
      $in: movie.movieTypes
    }
  })

  return movies
}

export const findAndRemove = async (id) => {
  let movie = await Movie.findOne({_id: id})

  if (movie) {
    await movie.remove()
  }
}