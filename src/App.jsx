// src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import MovieDetailPage from './pages/MovieDetailPage'
import PersonDetailPage from './pages/PersonDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import FavouritesPage from './pages/FavouritesPage'
import SearchResultPage from './pages/SearchResultPage'
import RequireAuth from './routes/RequireAuth'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 dark:text-slate-100">
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/person/:id" element={<PersonDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
          <Route
            path="/favourites"
            element={
              <RequireAuth>
                <FavouritesPage />
              </RequireAuth>
            }
          />
          <Route path="/search" element={<SearchResultPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
