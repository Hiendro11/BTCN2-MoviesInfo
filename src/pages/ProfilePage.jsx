import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProfile, updateProfile } from '../api/auth'

export default function ProfilePage() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: '',
    dob: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load() {
      if (!user) {
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        setError('')
        const profile = await getProfile()

        setForm({
          username: profile.username || user.username,
          email: profile.email || user.email || '',
          phone: profile.phone || '',
          dob: (profile.dob || '').slice(0, 10),
        })
      } catch (err) {
        console.error(err)
        setError('Không tải được profile từ API, tạm thời hiển thị thông tin local.')
        setForm(prev => ({
          ...prev,
          username: user.username || prev.username,
          email: user.email || prev.email,
        }))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return

    try {
      setSaving(true)
      setError('')
      setMessage('')

      const payload = {
        email: form.email,
        phone: form.phone,
        dob: form.dob || null,
      }

      const updated = await updateProfile(payload)

      setForm(prev => ({
        ...prev,
        email: updated.email || prev.email,
        phone: updated.phone || prev.phone,
        dob: (updated.dob || prev.dob || '').slice(0, 10),
      }))

      setMessage('Cập nhật thông tin thành công.')
    } catch (err) {
      console.error(err)
      setError('Cập nhật thất bại: ' + (err.message || 'Vui lòng thử lại.'))
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return <p className="mt-6 text-center text-sm">Bạn cần đăng nhập để xem Profile.</p>
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-700/50">
        <h1 className="text-xl font-semibold mb-2">Profile</h1>
        <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
          Xem và chỉnh sửa một số thông tin cá nhân của bạn.
        </p>

        {loading ? (
          <p className="text-sm">Đang tải profile...</p>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <p className="text-xs text-amber-500 bg-amber-50 dark:bg-amber-900/30 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}
            {message && (
              <p className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-2 rounded-lg">
                {message}
              </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Username
                </label>
                <input
                  value={form.username}
                  disabled
                  className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Địa chỉ Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Số điện thoại
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Ngày sinh
                </label>
                <input
                  name="dob"
                  type="date"
                  value={form.dob || ''}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        )}
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-medium">Danh sách phim yêu thích</p>
            <p className="text-xs">
              Xem lại toàn bộ các phim bạn đã đánh dấu ♥
            </p>
          </div>
          <Link
            to="/favourites"
            className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Xem phim yêu thích
          </Link>
        </div>
      </div>
    </div>
  )
}
