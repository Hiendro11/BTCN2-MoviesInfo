import React from 'react'
import { Link } from 'react-router-dom'
import { useFavourites } from '../context/FavouritesContext'

export default function MovieCard({ movie, compact = false }) {
  const { favourites, toggleFavourite } = useFavourites()
  if (!movie) return null

  const isFav = favourites.some((m) => m.id === movie.id)

  const rate =
    typeof movie.rate === 'number'
      ? movie.rate
      : typeof movie.rating === 'number'
      ? movie.rating
      : null

  const genres = Array.isArray(movie.genres) ? movie.genres : []

  const short =
    movie.short_description || movie.overview || movie.plot || movie.description

  const year =
    movie.year ||
    movie.release_year ||
    (typeof movie.releaseDate === 'string' ? movie.releaseDate.slice(0, 4) : '')

  // Hàng ngang: aspect 16/9, hover mạnh
  // Các chỗ khác: aspect linh hoạt hơn, hover nhẹ
  const aspect = compact ? 'aspect-[16/9]' : 'aspect-[2/3] md:aspect-[16/9]'

  const hoverClasses = compact
    ? // hiệu ứng giống video: phóng to, nhô lên, z-index cao, shadow mạnh
      'hover:z-30 hover:scale-[1.1] hover:-translate-y-6 hover:shadow-[0_20px_45px_rgba(15,23,42,0.9)]'
    : 'hover:z-10 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-2xl'

  return (
    <article
      className={`
        group relative cursor-pointer overflow-hidden rounded-3xl
        bg-slate-900/80 shadow-md ring-1 ring-slate-900/40
        transition-all duration-300
        ${hoverClasses}
      `}
    >
      {/* Toàn bộ card (trừ nút tim) là Link sang chi tiết */}
      <Link to={`/movie/${movie.id}`} className="block">
        <div className={`relative ${aspect}`}>
          {/* Poster */}
          {movie.image ? (
            <img
              src={movie.image}
              alt={movie.title}
              className={`
                h-full w-full object-cover
                transition-transform duration-500
                group-hover:scale-110
              `}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-700 via-slate-900 to-black">
              <span className="text-3xl font-semibold text-slate-200">
                {movie.title?.[0] || '?'}
              </span>
            </div>
          )}

          {/* Gradient phủ lên poster */}
          <div
            className={`
              pointer-events-none absolute inset-0
              bg-gradient-to-t from-black/95 via-black/60 to-transparent
              opacity-80 transition-opacity duration-300
              group-hover:opacity-100
            `}
          />

          {/* Khối thông tin phía dưới */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-3">
            {/* Tên phim */}
            <h3
              className={`
                text-sm font-semibold text-white md:text-base
                ${compact ? 'line-clamp-2' : 'line-clamp-1'}
              `}
            >
              {movie.title}
            </h3>

            {/* Dòng thông tin năm + thể loại + rating */}
            <div className="mt-1 flex flex-wrap items-center gap-1 text-[11px] text-slate-200">
              {year && <span className="opacity-90">{year}</span>}

              {genres.slice(0, 2).map((g) => (
                <span
                  key={g}
                  className="rounded-full bg-black/45 px-2 py-0.5 text-[10px]"
                >
                  {g}
                </span>
              ))}

              {rate && (
                <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-semibold text-slate-900">
                  <span>★</span>
                  <span>{rate.toFixed(1)}</span>
                </span>
              )}
            </div>

            {/* Mô tả ngắn: chỉ hiện rõ khi hover (đúng yêu cầu "có thêm thông tin") */}
            {short && (
              <p
                className={`
                  mt-1 max-h-0 overflow-hidden text-[11px] leading-snug text-slate-100
                  opacity-0 transition-all duration-300
                  group-hover:max-h-20 group-hover:opacity-100
                `}
              >
                {short}
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* Nút tim favourite – không điều hướng khi click */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          toggleFavourite(movie)
        }}
        className={`
          absolute right-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center
          rounded-full bg-black/55 text-xs text-slate-100 backdrop-blur
          transition-colors hover:bg-sky-500 hover:text-white
        `}
        aria-label={isFav ? 'Bỏ khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
      >
        {isFav ? '♥' : '♡'}
      </button>
    </article>
  )
}
