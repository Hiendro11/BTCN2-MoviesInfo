import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPersonDetail } from '../api/movies';

export default function PersonDetailPage() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        setLoading(true);
        setError('');
        const data = await getPersonDetail(id);
        if (!ignore) {
          setPerson(data);
        }
      } catch (err) {
        console.error('PersonDetail load error:', err);
        if (!ignore) {
          setError(err.message || 'Không tải được thông tin diễn viên/đạo diễn.');
          setPerson(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-sm text-slate-500">
          Đang tải thông tin diễn viên/đạo diễn...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-2xl border border-red-400/40 bg-red-950/40 p-6 text-sm text-red-100">
          <p className="font-semibold">Có lỗi xảy ra</p>
          <p className="mt-1">{error}</p>
        </div>
      </main>
    );
  }

  if (!person) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-center text-sm text-slate-500">
          Không tìm thấy thông tin người này.
        </p>
      </main>
    );
  }

  const {
    name,
    role,
    image,
    summary,
    birth_date,
    death_date,
    height,
    known_for = [],
  } = person;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Khối 1: avatar + info cơ bản */}
      <section className="grid gap-8 md:grid-cols-[220px,minmax(0,1fr)]">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-4">
          <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-xl w-[220px] h-[300px]">
            {image ? (
              <img
                src={image}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-700 via-slate-900 to-black">
                <span className="text-3xl font-semibold text-slate-200">
                  {name?.[0] || '?'}
                </span>
              </div>
            )}
          </div>

          {role && (
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-100">
              {role}
            </span>
          )}
        </div>

        {/* Thông tin chi tiết */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white md:text-3xl">
              {name}
            </h1>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-slate-700 dark:text-slate-200">
            {birth_date && (
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">
                Ngày sinh:{' '}
                {new Date(birth_date).toLocaleDateString('vi-VN')}
              </span>
            )}
            {death_date && (
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">
                Ngày mất:{' '}
                {new Date(death_date).toLocaleDateString('vi-VN')}
              </span>
            )}
            {height && (
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">
                Chiều cao: {height}
              </span>
            )}
          </div>

          {summary && (
            <div className="space-y-1 text-sm text-slate-800 dark:text-slate-100">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                Tiểu sử
              </h2>
              <p className="leading-relaxed">{summary}</p>
            </div>
          )}
        </div>
      </section>

      {/* Khối 2: danh sách phim đã tham gia */}
      {known_for.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Phim đã tham gia
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {known_for.map((m) => (
              <Link
                key={m.id}
                to={`/movie/${m.id}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-slate-900/90 shadow hover:-translate-y-1 hover:shadow-xl transition-all"
              >
                <div className="aspect-[2/3] w-full overflow-hidden">
                  {m.image ? (
                    <img
                      src={m.image}
                      alt={m.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-slate-800">
                      <span className="text-2xl font-semibold text-slate-200">
                        {m.title?.[0] || '?'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-1 p-3 text-xs text-slate-100">
                  <p className="font-semibold line-clamp-2">{m.title}</p>
                  {m.year && (
                    <p className="text-[11px] text-slate-300">Năm: {m.year}</p>
                  )}
                  {m.rate && (
                    <p className="text-[11px] text-yellow-300">
                      ★ {m.rate.toFixed?.(1) ?? m.rate}
                    </p>
                  )}
                  {m.character && (
                    <p className="text-[11px] text-slate-300">
                      Vai: {m.character}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
