// src/context/FavouritesContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { getFavorites, addFavorite, removeFavorite } from '../api/auth'

const FavouritesContext = createContext()

export function FavouritesProvider({ children }) {
  const { isLoggedIn } = useAuth()
  const [favourites, setFavourites] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function load() {
      if (!isLoggedIn) {
        setFavourites([])
        setError('')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        const res = await getFavorites()
        if (!ignore) {
          setFavourites(Array.isArray(res) ? res : [])
        }
      } catch (err) {
        if (!ignore) {
          console.error(err)
          setError(err.message || 'Không tải được danh sách yêu thích.')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [isLoggedIn])

  const toggleFavourite = async (movie) => {
    if (!isLoggedIn) {
      alert('Bạn cần đăng nhập để thêm phim yêu thích.')
      return
    }

    const exists = favourites.some((m) => m.id === movie.id)

    try {
      if (exists) {
        await removeFavorite(movie.id)
        setFavourites((prev) => prev.filter((m) => m.id !== movie.id))
      } else {
        await addFavorite(movie.id)
        setFavourites((prev) => [...prev, movie])
      }
    } catch (err) {
      console.error(err)
      alert('Không cập nhật được danh sách yêu thích. Vui lòng thử lại.')
    }
  }

  return (
    <FavouritesContext.Provider
      value={{ favourites, loading, error, toggleFavourite }}
    >
      {children}
    </FavouritesContext.Provider>
  )
}

export function useFavourites() {
  return useContext(FavouritesContext)
}
