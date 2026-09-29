'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  type: 'products' | 'actions'
  isDatabaseSource: boolean
  count: number
  onSync: () => Promise<{ success: boolean; count: number; error?: string }>
}

export default function SyncCatalogBanner({
  type,
  isDatabaseSource,
  count,
  onSync,
}: Props) {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success?: boolean; message?: string } | null>(null)
  const [showSqlGuide, setShowSqlGuide] = useState(false)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const label = type === 'products' ? 'sản phẩm' : 'micro-actions'

  const handleSyncClick = () => {
    setResult(null)
    startTransition(async () => {
      try {
        const res = await onSync()
        if (res.success) {
          setResult({
            success: true,
            message: `Đã đồng bộ thành công ${res.count} ${label} vào Supabase Database!`,
          })
          router.refresh()
        } else {
          setResult({
            success: false,
            message: res.error || 'Chưa thể đồng bộ lên Supabase.',
          })
          if (res.error?.includes('Could not find') || res.error?.includes('table') || res.error?.includes('PGRST205')) {
            setShowSqlGuide(true)
          }
        }
      } catch (err: any) {
        setResult({
          success: false,
          message: err?.message || 'Lỗi kết nối khi đồng bộ',
        })
      }
    })
  }

  const sampleSql = `-- Chạy lệnh này trong Supabase Dashboard -> SQL Editor
-- File đầy đủ có trong project: supabase/SETUP_ALL.sql

-- 1. Bảng Products
CREATE TABLE IF NOT EXISTS products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              TEXT UNIQUE NOT NULL,
  name              TEXT NOT NULL,
  category          TEXT NOT NULL,
  short_description TEXT,
  description       TEXT,
  price             NUMERIC(10,2),
  caffeine_mg       INTEGER,
  image_url         TEXT,
  active            BOOLEAN NOT NULL DEFAULT TRUE,
  featured          BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order        INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Bảng Micro Actions
CREATE TABLE IF NOT EXISTS micro_actions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT UNIQUE NOT NULL,
  category         TEXT NOT NULL,
  title            TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  description      TEXT,
  steps            JSONB NOT NULL DEFAULT '[]',
  active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cho phép đọc công khai
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE micro_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read products" ON products FOR SELECT USING (true);
CREATE POLICY "public read actions" ON micro_actions FOR SELECT USING (true);
CREATE POLICY "public insert products" ON products FOR ALL USING (true);
CREATE POLICY "public insert actions" ON micro_actions FOR ALL USING (true);
`

  const handleCopySql = () => {
    navigator.clipboard.writeText(sampleSql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="mb-6 space-y-3">
      <div
        className="p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md"
        style={{
          background: isDatabaseSource
            ? 'rgba(16, 185, 129, 0.08)'
            : 'rgba(245, 158, 11, 0.08)',
          borderColor: isDatabaseSource
            ? 'rgba(16, 185, 129, 0.25)'
            : 'rgba(245, 158, 11, 0.25)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{isDatabaseSource ? '🟢' : '⚡'}</span>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  background: isDatabaseSource
                    ? 'rgba(16, 185, 129, 0.2)'
                    : 'rgba(245, 158, 11, 0.2)',
                  color: isDatabaseSource ? '#10b981' : '#f59e0b',
                }}
              >
                {isDatabaseSource ? 'Database Supabase Trực Tiếp' : 'Hệ Thống Tiêu Chuẩn Fame Drink'}
              </span>
              <span className="text-xs text-white/50">· {count} mục sẵn sàng quản lý</span>
            </div>
            <p className="text-xs text-muted mt-1">
              {isDatabaseSource
                ? 'Dữ liệu được lưu trữ và đồng bộ hóa trực tiếp trên đám mây Supabase.'
                : 'Mặt hàng và micro-action đang hiển thị đầy đủ, cho phép chỉnh sửa giá, thông số và lưu trữ tức thì.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={handleSyncClick}
            disabled={isPending}
            className="btn btn-ghost text-xs border border-white/20 hover:border-amber-400 py-2 px-3 rounded-xl flex items-center gap-1.5 transition-all text-white w-full sm:w-auto justify-center"
          >
            <span>{isPending ? '⏳ Đang đồng bộ…' : '⚡ Đẩy vào Supabase'}</span>
          </button>
          {!isDatabaseSource && (
            <button
              onClick={() => setShowSqlGuide(!showSqlGuide)}
              className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2 px-2 py-1"
            >
              {showSqlGuide ? 'Đóng SQL' : 'Xem SQL'}
            </button>
          )}
        </div>
      </div>

      {result && (
        <div
          className="p-3 rounded-xl text-xs font-medium flex items-center justify-between border"
          style={{
            background: result.success ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            color: result.success ? '#34d399' : '#f87171',
            borderColor: result.success ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)',
          }}
        >
          <span>{result.message}</span>
          <button
            onClick={() => setResult(null)}
            className="text-white/60 hover:text-white ml-2 text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {showSqlGuide && (
        <div className="surface p-4 rounded-2xl border border-amber-400/30 bg-black/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300">
              📋 Hướng Dẫn Kích Hoạt Database Supabase (Chỉ làm 1 lần)
            </span>
            <button
              onClick={handleCopySql}
              className="btn btn-ghost text-[11px] py-1 px-2.5 rounded-lg border border-amber-400/40 text-amber-300 hover:bg-amber-400/10"
            >
              {copied ? '✓ Đã Copy' : 'Copy Đoạn SQL Này'}
            </button>
          </div>
          <p className="text-[11px] text-muted">
            1. Vào <strong className="text-white">Supabase Dashboard</strong> → Chọn dự án → Vào mục <strong className="text-white">SQL Editor</strong>.<br />
            2. Dán đoạn mã dưới đây (hoặc file <code className="text-amber-300">supabase/SETUP_ALL.sql</code>) và nhấn <strong className="text-white">Run</strong>.<br />
            3. Quay lại đây và nhấn nút <strong>⚡ Đẩy vào Supabase</strong>.
          </p>
          <pre className="p-3 rounded-xl bg-black/80 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-48 border border-white/10">
            {sampleSql}
          </pre>
        </div>
      )}
    </div>
  )
}
