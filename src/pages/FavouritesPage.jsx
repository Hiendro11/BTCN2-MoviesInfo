// src/pages/FavouritesPage.jsx
import React, { useMemo, useState, useEffect } from 'react'
import { useFavourites } from '../context/FavouritesContext'
import MovieCard from '../components/MovieCard'

export default function FavouritesPage() {
  const { favourites, loading, error } = useFavourites()
  const [page, setPage] = useState(1)
  const pageSize = 8

  useEffect(() => {
    // reset về trang 1 nếu số lượng phim thay đổi mà page hiện tại không còn hợp lệ
    const totalPages = Math.max(
      1,
      Math.ceil((favourites?.length || 0) / pageSize),
    )
    if (page > totalPages) setPage(totalPages)
  }, [favourites, page])

  const totalPages = Math.max(
    1,
    Math.ceil((favourites?.length || 0) / pageSize),
  )

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return favourites.slice(start, start + pageSize)
  }, [favourites, page])

  return (
    <main className="space-y-4">
      <header className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
            Danh sách phim yêu thích
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tổng cộng {favourites.length} phim
          </p>
        </div>
      </header>

      {loading && (
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Đang tải danh sách yêu thích…
        </p>
      )}

      {error && (
        <div className="rounded-2xl border border-yellow-400/50 bg-yellow-50 dark:bg-yellow-900/20 p-3 text-xs text-yellow-800 dark:text-yellow-100">
          {error}
        </div>
      )}

      {!loading && !error && favourites.length === 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Bạn chưa thêm phim nào vào danh sách yêu thích.
        </p>
      )}

      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {pageItems.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </section>

      {favourites.length > pageSize && (
        <div className="mt-2 flex items-center justify-center gap-3 text-xs">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-full bg-slate-200 px-3 py-1 text-slate-800 hover:bg-slate-300 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            « Trước
          </button>
          <span className="text-slate-600 dark:text-slate-300">
            Trang {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
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
