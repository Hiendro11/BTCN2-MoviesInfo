// src/pages/RegisterPage.jsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { registerUser } from '../api/auth'
import { useNavigate, Link } from 'react-router-dom'

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()
  const navigate = useNavigate()
  const password = watch('password')

  const onSubmit = async (values) => {
    try {
      const payload = {
        username: values.username,
        email: values.email,
        password: values.password,
        phone: values.phone || '',
        dob: values.dob || '',
      }
      await registerUser(payload)
      alert('Đăng ký thành công, hãy đăng nhập.')
      navigate('/login')
    } catch (err) {
      console.error(err)
      alert('Đăng ký thất bại: ' + (err.message || 'Vui lòng thử lại.'))
    }
  }

  return (
    <div className="max-w-md mx-auto mt-6 bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50">
        Register
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
            Email
          </label>
          <input
            type="email"
            {...register('email', {
              required: 'Email là bắt buộc',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email không hợp lệ',
              },
            })}
            className="mt-1 w-full px-3 py-2 rounded-md border text-sm bg-slate-50 dark:bg-slate-900 dark:border-slate-700"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm text-slate-700 dark:text-slate-200">
            Phone
          </label>
          <input
            type="tel"
            {...register('phone', {
              pattern: {
                value: /^[0-9+\-\s]{6,20}$/,
                message: 'Số điện thoại không hợp lệ',
              },
            })}
            className="mt-1 w-full px-3 py-2 rounded-md border text-sm bg-slate-50 dark:bg-slate-900 dark:border-slate-700"
          />
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm text-slate-700 dark:text-slate-200">
            Ngày sinh
          </label>
          <input
            type="date"
            {...register('dob')}
            className="mt-1 w-full px-3 py-2 rounded-md border text-sm bg-slate-50 dark:bg-slate-900 dark:border-slate-700"
          />
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

        <div>
          <label className="text-sm text-slate-700 dark:text-slate-200">
            Confirm password
          </label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'Vui lòng nhập lại mật khẩu',
              validate: (value) =>
                value === password || 'Mật khẩu không khớp',
            })}
            className="mt-1 w-full px-3 py-2 rounded-md border text-sm bg-slate-50 dark:bg-slate-900 dark:border-slate-700"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className="w-full py-2 rounded-md bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-sm font-semibold"
        >
          {isSubmitting ? 'Đang đăng ký...' : 'Register'}
        </button>
      </form>

      <p className="mt-3 text-xs text-center text-slate-600 dark:text-slate-300">
        Đã có tài khoản?{' '}
        <Link to="/login" className="underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  )
}
