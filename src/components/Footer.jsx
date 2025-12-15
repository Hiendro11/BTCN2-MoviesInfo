import React from 'react'

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-800 bg-slate-950/95 text-slate-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-[11px] sm:flex-row sm:items-center sm:justify-between">
        <p>
          MSSV: <strong>22120102</strong> – Trần Xuân Minh Hiển
        </p>
        <p>Đồ án: Movies Info </p>
        <p>Email: <span className="underline">txm.hien1102@gmail.com</span></p>
      </div>
    </footer>
  )
}
