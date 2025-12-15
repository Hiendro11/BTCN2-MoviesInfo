// src/pages/PersonDetailPage.jsx
import React, { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPersonDetail } from '../api/movies'
import MovieCard from '../components/MovieCard'

export default function PersonDetailPage() {
  const { id } = useParams()
  const [person, setPerson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 8

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        setLoading(true)
        setError('')
        const res = await getPersonDetail(id)
        if (!ignore) {
          setPerson(res)
          setPage(1)
        }
      } catch (err) {
        console.error(err)
        if (!ignore) setError('Không tải được thông tin người này.')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [id])

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-center text-sm text-slate-500 dark:text-slate-300">
          Đang tải thông tin…
        </p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
      </main>
    )
  }

  if (!person) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-center text-sm text-slate-500 dark:text-slate-300">
          Không tìm thấy thông tin.
        </p>
      </main>
    )
  }

  const movies = Array.isArray(person.known_for) ? person.known_for : []
  const totalPages = Math.max(1, Math.ceil(movies.length / pageSize))
  const pageMovies = useMemo(() => {
    const start = (page - 1) * pageSize
    return movies.slice(start, start + pageSize)
  }, [movies, page])

  const poster =
    person.image || person.profile_path || person.avatar || person.photo

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <section className="flex flex-col gap-6 md:flex-row">
        {poster && (
          <img
            src={poster}
            alt={person.name}
            className="h-72 w-52 rounded-2xl object-cover shadow-lg"
          />
        )}

        <div className="space-y-3 text-sm">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            {person.name}
          </h1>
          {person.role && (
            <p className="text-slate-600 dark:text-slate-300">
              {person.role}
            </p>
          )}

          {(person.birth_date || person.death_date || person.height) && (
            <div className="space-y-1 text-slate-700 dark:text-slate-200">
              {person.birth_date && (
                <p>
                  <span className="font-semibold">Ngày sinh: </span>
                  {person.birth_date}
                </p>
              )}
              {person.death_date && (
                <p>
                  <span className="font-semibold">Ngày mất: </span>
                  {person.death_date}
                </p>
              )}
              {person.height && (
                <p>
                  <span className="font-semibold">Chiều cao: </span>
                  {person.height}
                </p>
              )}
            </div>
          )}

          {person.summary && (
            <p className="mt-2 max-w-xl text-slate-800 dark:text-slate-200 leading-relaxed">
              {person.summary}
            </p>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Phim đã tham gia
        </h2>

        {movies.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Chưa có dữ liệu phim cho người này.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {pageMovies.map((m) => (
            <div key={m.id} className="flex flex-col gap-1">
              <MovieCard movie={m} />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                Vai trò: {m.role || 'N/A'}
                {m.character && ` • Nhân vật: ${m.character}`}
              </p>
            </div>
          ))}
        </div>

        {movies.length > pageSize && (
          <div className="mt-1 flex items-center justify-center gap-3 text-xs">
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
      </section>
    </main>
  )
}
