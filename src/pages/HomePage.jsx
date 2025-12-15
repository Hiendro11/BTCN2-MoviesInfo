// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMostPopularMovies, getTopRatedMovies } from '../api/movies'
import MovieCarousel from '../components/MovieCarousel'

export default function HomePage() {
  const [popular, setPopular] = useState([])
  const [topRated, setTopRated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [revenueIndex, setRevenueIndex] = useState(0)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError('')

        // Lấy nhiều hơn 5 item để dùng cho cả Top 5 + 2 carousel
        const [pop, rate] = await Promise.all([
          getMostPopularMovies({ page: 1, limit: 20 }),
          getTopRatedMovies({ page: 1, limit: 18 }),
        ])

        setPopular(pop || [])
        setTopRated(rate || [])
        setRevenueIndex(0)
      } catch (err) {
        console.error('HomePage load error:', err)
        setError('Không tải được dữ liệu (API / CORS).')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // Top 5 phim doanh thu cao nhất: lấy 5 phim đầu trong popular
  const topRevenue = Array.isArray(popular) ? popular.slice(0, 5) : []
  const highlightMovie =
    topRevenue[revenueIndex] || topRevenue[0] || popular[0] || topRated[0]

  const handlePrev = () => {
    if (!topRevenue.length) return
    setRevenueIndex((i) => (i === 0 ? topRevenue.length - 1 : i - 1))
  }

  const handleNext = () => {
    if (!topRevenue.length) return
    setRevenueIndex((i) => (i === topRevenue.length - 1 ? 0 : i + 1))
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-center text-sm text-slate-500 dark:text-slate-300">
          Đang tải dữ liệu…
        </p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-center text-sm text-red-500">{error}</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-10">
      {/* ========= HERO: TOP DOANH THU ========= */}
      <section className="space-y-5">
        <header className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Movies info
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Phim có doanh thu cao nhất
          </p>
        </header>

        {highlightMovie && (
          <div className="relative">
            {/* nút prev / next (ẩn trên mobile nhỏ) */}
            {topRevenue.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Phim trước"
                  className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-slate-300/70 bg-white/90 text-slate-700 shadow-md transition hover:bg-slate-900 hover:text-white dark:border-slate-600 dark:bg-slate-800/90 dark:text-slate-100 dark:hover:bg-slate-100 dark:hover:text-slate-900"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Phim tiếp theo"
                  className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-slate-300/70 bg-white/90 text-slate-700 shadow-md transition hover:bg-slate-900 hover:text-white dark:border-slate-600 dark:bg-slate-800/90 dark:text-slate-100 dark:hover:bg-slate-100 dark:hover:text-slate-900"
                >
                  ›
                </button>
              </>
            )}

            {/* poster chính – CLICK để xem chi tiết */}
            <Link
              to={`/movie/${highlightMovie.id}`}
              className="group mx-auto block max-w-xl sm:max-w-2xl"
            >
              <div className="relative overflow-hidden rounded-[32px] bg-white/90 shadow-xl ring-1 ring-slate-900/5 transition-transform duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl dark:bg-slate-900/90 dark:ring-slate-100/10">
                {highlightMovie.image ? (
                  <img
                    src={highlightMovie.image}
                    alt={highlightMovie.title}
                    className="h-[420px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-[420px] items-center justify-center bg-gradient-to-br from-slate-700 via-slate-900 to-black">
                    <span className="text-4xl font-semibold text-slate-100">
                      {highlightMovie.title?.[0] || '?'}
                    </span>
                  </div>
                )}

                {/* overlay thông tin */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-6 pb-6 pt-24">
                  <p className="text-[11px] uppercase tracking-wide text-slate-200/90">
                    Bấm để xem chi tiết
                  </p>
                  <h2 className="mt-1 line-clamp-2 text-xl font-semibold text-slate-50 md:text-2xl">
                    {highlightMovie.title}
                  </h2>
                  <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-200/90">
                    {highlightMovie.year && (
                      <span>{highlightMovie.year}</span>
                    )}
                    {Array.isArray(highlightMovie.genres) &&
                      highlightMovie.genres.slice(0, 3).map((g) => (
                        <span key={g}>{g}</span>
                      ))}
                    {typeof highlightMovie.rate === 'number' && (
                      <span className="font-semibold">
                        ★ {highlightMovie.rate.toFixed(1)}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </Link>

            {/* chấm chuyển 5 phim doanh thu cao nhất */}
            {topRevenue.length > 1 && (
              <div className="mt-4 flex justify-center gap-2">
                {topRevenue.map((m, idx) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setRevenueIndex(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      idx === revenueIndex
                        ? 'w-6 bg-slate-900 dark:bg-slate-100'
                        : 'w-2 bg-slate-300 dark:bg-slate-600'
                    }`}
                    aria-label={`Chọn phim ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ========= MOST POPULAR ========= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Most Popular
          </h2>
          <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
            
          </p>
        </div>
        <MovieCarousel title="Most Popular" movies={popular} compact />
      </section>

      {/* ========= TOP RATING ========= */}
      <section className="space-y-3 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Top Rating
          </h2>
          <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
            Các phim được đánh giá cao nhất từ bảng xếp hạng.
          </p>
        </div>
        <MovieCarousel title="Top Rating" movies={topRated} compact />
      </section>
    </main>
  )
}
