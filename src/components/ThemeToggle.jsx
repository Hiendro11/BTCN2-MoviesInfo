import React from 'react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 rounded-full border text-xs hover:bg-slate-100 dark:hover:bg-slate-700"
    >
      {theme === 'dark' ? 'Light' : 'Dark'} mode
    </button>
  )
}
