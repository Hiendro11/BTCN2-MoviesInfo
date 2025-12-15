// src/api/client.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const APP_TOKEN = import.meta.env.VITE_API_TOKEN || ''

// (tuỳ bạn dùng hay không, cho sau này login xong lưu JWT)
function getUserToken() {
  try {
    return localStorage.getItem('accessToken') || ''
  } catch {
    return ''
  }
}

export async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  // App token cho backend (theo lỗi x-app-token)
  if (APP_TOKEN && !('x-app-token' in headers)) {
    headers['x-app-token'] = APP_TOKEN
  }

  // Token user (sau khi login), nếu bạn có dùng
  const userToken = getUserToken()
  if (userToken && !('Authorization' in headers)) {
    headers['Authorization'] = `Bearer ${userToken}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    // ném body lỗi ra ngoài cho dễ debug
    throw new Error(text || `Request failed with status ${res.status}`)
  }

  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return res.json()
  }
  return res.text()
}
