// src/pages/LoginPage.jsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { loginUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation, Link } from 'react-router-dom'

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const onSubmit = async (values) => {
    try {
      const res = await loginUser(values) // { message, token, user }
      const { token, user } = res

      login({ user, token })

      const redirectTo = location.state?.from?.pathname || '/'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      console.error(err)
      alert('Đăng nhập thất bại: ' + (err.message || 'Vui lòng thử lại.'))
    }
  }

  return (
    <div className="max-w-md mx-auto mt-6 bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50">
        Login
      </h1>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="text-sm text-slate-700 dark:text-slate-200">
            Username
          </label>
          <input
            {...register('username', {
              required: 'Username là bắt buộc',
              minLength: { value: 3, message: 'Tối thiểu 3 ký tự' },
            })}
            className="mt-1 w-full px-3 py-2 rounded-md border text-sm bg-slate-50 dark:bg-slate-900 dark:border-slate-700"
          />
          {errors.username && (
            <p className="text-xs text-red-500 mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm text-slate-700 dark:text-slate-200">
            Password
          </label>
          <input
            type="password"
            {...register('password', {
              required: 'Password là bắt buộc',
              minLength: { value: 6, message: 'Tối thiểu 6 ký tự' },
            })}
            className="mt-1 w-full px-3 py-2 rounded-md border text-sm bg-slate-50 dark:bg-slate-900 dark:border-slate-700"
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className="w-full py-2 rounded-md bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-sm font-semibold"
        >
          {isSubmitting ? 'Đang đăng nhập...' : 'Login'}
        </button>
      </form>

      <p className="mt-3 text-xs text-center text-slate-600 dark:text-slate-300">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="underline">
          Đăng ký
        </Link>
      </p>
    </div>
  )
}
