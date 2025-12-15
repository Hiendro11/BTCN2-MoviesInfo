import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchMovies } from '../api/movies'
import MovieCard from '../components/MovieCard'

export default function SearchResultPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [mode, setMode] = useState('title') 
  const [page, setPage] = useState(1)
  const [state, setState] = useState({
    loading: false,
    error: '',
    results: [],
    pagination: null,
  })

  useEffect(() => {
    setPage(1)
  }, [query, mode])

  useEffect(() => {
    if (!query) return

    let ignore = false

    async function load() {
      try {
        setState((s) => ({ ...s, loading: true, error: '' }))

        const params = { page, limit: 12 }
        if (mode === 'person') params.person = query
        else if (mode === 'genre') params.genre = query
        else if (mode === 'q') params.q = query
        else params.title = query

        const res = await searchMovies(params)

        if (!ignore) {
          setState({
            loading: false,
            error: '',
            results: res.items || [],
            pagination: res.pagination || null,
          })
        }
      } catch (err) {
        if (!ignore) {
          setState({
            loading: false,
            error: err.message || 'Không tìm được kết quả',
            results: [],
            pagination: null,
          })
        }
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [query, mode, page])

  const { loading, error, results, pagination } = state
  const totalPages = pagination?.total_pages || 1
  const currentPage = pagination?.current_page || page
  const totalItems = pagination?.total_items ?? results.length

  if (!query) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-6">
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Nhập từ khóa .
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Kết quả tìm kiếm cho “{query}”
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {totalItems} kết quả – trang {currentPage} / {totalPages}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { id: 'title', label: 'Theo tên phim' },
            { id: 'person', label: 'Theo diễn viên / đạo diễn' },
            { id: 'genre', label: 'Theo thể loại' },
            { id: 'q', label: 'Tìm kiếm thông minh (q)' },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setMode(opt.id)}
              className={`rounded-full px-3 py-1 transition-colors ${
                mode === opt.id
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </header>

      {loading && (
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Đang tải kết quả…
        </p>
      )}

      {error && (
        <div className="rounded-2xl border border-red-400/40 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-100">
          {error}
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Không có phim phù hợp.
        </p>
      )}

      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {results.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </section>

      {totalPages > 1 && (
        <div className="mt-2 flex items-center justify-center gap-3 text-xs">
          <button
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-full bg-slate-200 px-3 py-1 text-slate-800 hover:bg-slate-300 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            « Trước
          </button>
          <span className="text-slate-600 dark:text-slate-300">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-full bg-slate-200 px-3 py-1 text-slate-800 hover:bg-slate-300 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Sau »
          </button>
        </div>
      )}
    </main>
  )
}
