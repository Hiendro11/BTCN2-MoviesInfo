import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    const q = new FormData(e.currentTarget).get('q')?.toString().trim()
    if (!q) return
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="w-full bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-50 shadow-sm">
      {/* 1. Thanh MSSV + Dark mode (full width) */}
      <div className="border-b border-slate-300/70 bg-slate-200/80 px-4 py-1 text-[11px] text-slate-600 dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-300">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span>
             <strong>22120102</strong> 
          </span>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1 rounded-full border border-slate-400/70 bg-white px-3 py-0.5 text-[11px] font-medium text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          >
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </div>

     

      {/* 3. Thanh Nav: Home + Search + Login/Register/Favourites */}
      <div className="border-b border-slate-200 bg-slate-100/90 dark:border-slate-700 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2">
          {/* Nút về Home như icon house */}
          <Link
            to="/"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-xs shadow-sm hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800"
            title="Về trang Home"
          >
            🏠
          </Link>

          {/* Form search */}
          <form
            onSubmit={handleSearch}
            className="flex flex-1 items-center gap-2"
          >
            <input
              name="q"
              placeholder="Search movie..."
              className="h-8 w-full rounded-full border border-slate-300 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
            <button
              type="submit"
              className="h-8 rounded-full bg-slate-800 px-3 text-xs font-medium text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Search
            </button>
          </form>

          {}
          <nav className="ml-1 flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-200">
            <Link to="/" className="px-2 hover:text-sky-500">
              Home
            </Link>

            {user && (
              <Link to="/favourites" className="px-2 hover:text-sky-500">
                Favourites
              </Link>
            )}

            {user ? (
              <>
                <Link to="/profile" className="px-1 font-semibold hover:text-sky-500">
                  {user.username}
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="px-1 text-red-500 hover:text-red-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-1 hover:text-sky-500">
                  Login
                </Link>
                <Link to="/register" className="px-1 hover:text-sky-500">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>s
    </header>
  )
}
