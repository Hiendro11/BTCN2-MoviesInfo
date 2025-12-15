import React, { useMemo, useState } from 'react'
import MovieCard from './MovieCard'
import SectionTitle from './SectionTitle'

export default function MovieCarousel({ title, movies }) {
  const [page, setPage] = useState(0)
  const pageSize = 3

  const totalPages = Math.ceil((movies?.length || 0) / pageSize)

  const current = useMemo(() => {
    if (!Array.isArray(movies)) return []
    const start = page * pageSize
    return movies.slice(start, start + pageSize)
  }, [movies, page])

  const handlePrev = () => {
    if (!totalPages) return
    setPage(p => (p === 0 ? totalPages - 1 : p - 1))
  }

  const handleNext = () => {
    if (!totalPages) return
    setPage(p => (p === totalPages - 1 ? 0 : p + 1))
  }

  if (!movies || !movies.length) return null

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <SectionTitle>{title}</SectionTitle>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-sm text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-sm text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            ›
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {current.map(movie => (
            <MovieCard key={movie.id} movie={movie} compact />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-3 flex justify-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-4 rounded-full ${
                  i === page
                    ? 'bg-slate-900 dark:bg-slate-100'
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
