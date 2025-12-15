import { apiFetch } from './client'

export function registerUser(data) {
  return apiFetch('/users/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function loginUser({ username, password }) {
  const res = await apiFetch('/users/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  return res
}

export function logoutUser() {
  return apiFetch('/users/logout', {
    method: 'POST',
  })
}

export function getProfile() {
  return apiFetch('/users/profile')
}

export function updateProfile(data) {
  return apiFetch('/users/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function getFavorites() {
  return apiFetch('/users/favorites')
}

export function addFavorite(movieId) {
  return apiFetch(`/users/favorites/${movieId}`, {
    method: 'POST',
  })
}

export function removeFavorite(movieId) {
  return apiFetch(`/users/favorites/${movieId}`, {
    method: 'DELETE',
  })
}
