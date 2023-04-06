const service = require('./movies.service')
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')


// gets all movies
async function list(req, res, next) {
    const isShowing = req.query.is_showing
    if (isShowing) {
       res.json({ data: await service.listMovie() })
    } else {
        res.json({ data: await service.list() })
    }
}

// return single movie
async function read(req, res, next) {
    res.json({ data: res.locals.movie })
}

// gets all movie theaters
async function listMovieTheaters(req, res, next) {
    const movieId = req.params.movieId
    res.json({ data: await service.listMovieTheaters(movieId)})
}

// list all movie reviews
async function listMovieReviews(req, res, next) {
    const movieId = req.params.movieId
    const result = await service.listMovieReviews(movieId)
    res.json({ data: result })
}

// check if movie is real
async function movieIsValid(req, res, next) {
    const movie = await service.read(req.params.movieId)
    if (movie) {
        res.locals.movie = movie
        console.log(movie) 
        return next()
    }
    next({ status: 404, message: 'Movie cannot be found' })
}

module.exports = {
    list: [asyncErrorBoundary(list)],
    read: [asyncErrorBoundary(movieIsValid), asyncErrorBoundary(read)],
    listMovieTheaters: [asyncErrorBoundary(movieIsValid), asyncErrorBoundary(listMovieTheaters)],
    listMovieReviews: [asyncErrorBoundary(movieIsValid), asyncErrorBoundary(listMovieReviews)],
}