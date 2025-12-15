import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMovieDetail, getMovieReviews } from '../api/movies'
import { useFavourites } from '../context/FavouritesContext'
import MovieCard from '../components/MovieCard'

function formatRuntime(runtime) {
  if (!runtime) return null
  if (typeof runtime === 'string') return runtime
  const mins = Number(runtime)
  if (!mins) return null
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h ? `${h}h ${m}m` : `${m} mins`
}

export default function MovieDetailPage() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [reviewPage, setReviewPage] = useState(1)
  const [reviewsState, setReviewsState] = useState({
    loading: false,
    error: '',
    items: [],
    pagination: null,
  })

  const { favourites, toggleFavourite } = useFavourites()
  const isFav = favourites.some((m) => m.id === id)

  useEffect(() => {
    let ignore = false

    async function loadDetail() {
      try {
        setLoading(true)
        setError('')
        const data = await getMovieDetail(id)
        if (!ignore) {
          setMovie(data)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      } catch (err) {
        console.error(err)
        if (!ignore) {
          setError(
            err.message || 'Không tải được thông tin phim. Hãy kiểm tra endpoint.',
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadDetail()
    return () => {
      ignore = true
    }
  }, [id])

  useEffect(() => {
    let ignore = false
    async function loadReviews() {
      try {
        setReviewsState((s) => ({ ...s, loading: true, error: '' }))
        const res = await getMovieReviews(id, {
          page: reviewPage,
          limit: 4,
          sort: 'newest',
        })
        if (!ignore) {
          setReviewsState({
            loading: false,
            error: '',
            items: res.reviews,
            pagination: res.pagination,
          })
        }
      } catch (err) {
        console.error(err)
        if (!ignore) {
          setReviewsState((s) => ({
            ...s,
            loading: false,
            error: 'Không tải được đánh giá.',
          }))
        }
      }
    }
    loadReviews()
    return () => {
      ignore = true
    }
  }, [id, reviewPage])

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-center text-sm text-slate-500 dark:text-slate-300">
          Đang tải chi tiết phim…
        </p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-2xl border border-red-400/40 bg-red-50 p-6 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-100">
          <p className="font-semibold">Có lỗi xảy ra</p>
          <p className="mt-1">{error}</p>
        </div>
      </main>
    )
  }

  if (!movie) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-center text-sm text-slate-500 dark:text-slate-300">
          Không tìm thấy phim.
        </p>
      </main>
    )
  }

  const poster =
    movie.image || movie.posterUrl || movie.poster_path || movie.posterURL
  const directors = Array.isArray(movie.directors) ? movie.directors : []
  const actors = Array.isArray(movie.actors) ? movie.actors : []
  const similar = Array.isArray(movie.similar_movies) ? movie.similar_movies : []
  const runtime = formatRuntime(movie.runtime)
  const rating =
    typeof movie.rate === 'number'
      ? movie.rate
      : typeof movie.rating === 'number'
      ? movie.rating
      : null

  const { loading: rvLoading, error: rvError, items: reviews, pagination } =
    reviewsState
  const totalReviewPages = pagination?.total_pages || 1
  const currentReviewPage = pagination?.current_page || reviewPage

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-10">
      {/* Block 1 – poster + info chính */}
      <section className="grid gap-8 md:grid-cols-[260px,minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-xl">
            {poster ? (
              <img
                src={poster}
                alt={movie.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[2/3] items-center justify-center bg-gradient-to-br from-slate-700 via-slate-900 to-black">
                <span className="text-3xl font-semibold text-slate-200">
                  {movie.title?.[0] || '?'}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => toggleFavourite(movie)}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              isFav
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200'
            }`}
          >
            {isFav ? '♥ Đã trong danh sách yêu thích' : '♡ Thêm vào danh sách yêu thích'}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 md:text-3xl">
              {movie.title}
            </h1>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              {movie.full_title || movie.short_description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {movie.year && (
              <span className="rounded-full bg-slate-200 px-3 py-1 text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                Năm: {movie.year}
              </span>
            )}
            {runtime && (
              <span className="rounded-full bg-slate-200 px-3 py-1 text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                Thời lượng: {runtime}
              </span>
            )}
            {rating && (
              <span className="rounded-full bg-yellow-400 px-3 py-1 text-slate-900 text-xs font-semibold">
                ★ {rating.toFixed(1)}
              </span>
            )}
            {Array.isArray(movie.genres) &&
              movie.genres.slice(0, 3).map((g) => (
                <span
                  key={g}
                  className="rounded-full bg-slate-200 px-3 py-1 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                >
                  {g}
                </span>
              ))}
          </div>

          {movie.plot_full && (
            <div className="space-y-1 text-sm">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Nội dung
              </h2>
              <p className="leading-relaxed text-slate-800 dark:text-slate-200">
                {movie.plot_full}
              </p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {directors.length > 0 && (
              <div className="text-sm">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Đạo diễn
                </p>
                <ul className="mt-1 space-y-1 text-slate-700 dark:text-slate-200">
                  {directors.map((d) => (
                    <li key={d.id}>
                      <Link
                        to={`/person/${d.id}`}
                        className="text-sky-600 hover:underline dark:text-sky-400"
                      >
                        {d.name}
                      </Link>
                      {d.role && (
                        <span className="text-slate-500 dark:text-slate-400">
                          {' '}
                          – {d.role}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {actors.length > 0 && (
              <div className="text-sm">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Diễn viên chính
                </p>
                <ul className="mt-1 space-y-1 text-slate-700 dark:text-slate-200">
                  {actors.slice(0, 6).map((a) => (
                    <li key={a.id}>
                      <Link
                        to={`/person/${a.id}`}
                        className="text-sky-600 hover:underline dark:text-sky-400"
                      >
                        {a.name}
                      </Link>
                      {a.character && (
                        <span className="text-slate-500 dark:text-slate-400">
                          {' '}
                          – {a.character}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Block 2 – Reviews có phân trang */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Đánh giá
        </h2>

        {rvLoading && (
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Đang tải đánh giá…
          </p>
        )}

        {rvError && (
          <p className="text-sm text-red-600 dark:text-red-300">{rvError}</p>
        )}

        {!rvLoading && !rvError && reviews.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Chưa có đánh giá nào cho phim này.
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((r) => (
            <article
              key={r.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900/80"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-slate-900 dark:text-slate-50">
                  {r.username}
                </p>
                <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-semibold text-slate-900">
                  ★ {r.rate}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {r.date && new Date(r.date).toLocaleDateString()}
                {r.warning_spoilers && ' · Có tiết lộ nội dung'}
              </p>
              <p className="mt-2 font-medium text-slate-900 dark:text-slate-100">
                {r.title}
              </p>
              <p className="mt-1 text-slate-700 dark:text-slate-200">
                {r.content}
              </p>
            </article>
          ))}
        </div>

        {totalReviewPages > 1 && (
          <div className="mt-1 flex items-center justify-center gap-3 text-xs">
            <button
              disabled={currentReviewPage <= 1}
              onClick={() => setReviewPage((p) => p - 1)}
              className="rounded-full bg-slate-200 px-3 py-1 text-slate-800 hover:bg-slate-300 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              « Trước
            </button>
            <span className="text-slate-600 dark:text-slate-300">
              Trang {currentReviewPage} / {totalReviewPages}
            </span>
            <button
              disabled={currentReviewPage >= totalReviewPages}
              onClick={() => setReviewPage((p) => p + 1)}
              className="rounded-full bg-slate-200 px-3 py-1 text-slate-800 hover:bg-slate-300 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              Sau »
            </button>
          </div>
        )}
      </section>

      {/* Block 3 – Phim tương tự */}
      {similar.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Phim tương tự
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {similar.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
