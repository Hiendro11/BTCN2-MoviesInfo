// src/api/movies.js
import { apiFetch } from './client'

function buildQuery(params) {
  const sp = new URLSearchParams()
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    sp.append(key, String(value))
  })
  const qs = sp.toString()
  return qs ? `?${qs}` : ''
}

/**
 * GET /movies
 * -> { data: Movie[], pagination }
 */
export async function getMovies(params = {}) {
  const res = await apiFetch(`/movies${buildQuery(params)}`)
  return {
    items: res?.data || [],
    pagination: res?.pagination || null,
  }
}

/**
 * GET /movies/search
 * params: { q?, title?, genre?, person?, page?, limit? }
 * -> { data: Movie[], pagination }
 */
export async function searchMovies(params = {}) {
  const res = await apiFetch(`/movies/search${buildQuery(params)}`)
  return {
    items: res?.data || [],
    pagination: res?.pagination || null,
  }
}


export async function getTopRatedMovies(params = {}) {
  const res = await apiFetch(`/movies/top-rated${buildQuery(params)}`)
  return res?.data || []
}


export async function getMostPopularMovies(params = {}) {
  const res = await apiFetch(`/movies/most-popular${buildQuery(params)}`)
  return res?.data || []
}


export async function getMovieDetail(id) {
  if (!id) throw new Error('movie id is required')
  return apiFetch(`/movies/${id}`)
}


export async function getMovieReviews(movieId, params = {}) {
  if (!movieId) throw new Error('movieId is required')
  const res = await apiFetch(
    `/movies/${movieId}/reviews${buildQuery(params)}`
  )
  return {
    movieId: res?.movie_id,
    movieTitle: res?.movie_title,
    reviews: res?.data || [],
    pagination: res?.pagination || null,
  }
}
// Lấy credits (đạo diễn + diễn viên) từ chi tiết phim
export async function getMovieCredits(id) {
  const movie = await getMovieDetail(id)
  return {
    directors: movie?.directors || [],
    actors: movie?.actors || [],
  }
}

/**
 * GET /persons
 * -> { data: PersonCard[], pagination }
 */
export async function getPersons(params = {}) {
  const res = await apiFetch(`/persons${buildQuery(params)}`)
  return {
    items: res?.data || [],
    pagination: res?.pagination || null,
  }
}

/**
 * GET /persons/{id}
 * -> Person detail + known_for[]
 */
export async function getPersonDetail(id) {
  if (!id) throw new Error('person id is required')
  return apiFetch(`/persons/${id}`)
}
