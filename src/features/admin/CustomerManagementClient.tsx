'use client'

import { useState } from 'react'
import type { CustomerSummary } from './customer-actions'
import { 
  recordManualDrink, 
  claimCustomerReward, 
  quickCreateCustomer 
} from './customer-actions'
import { 
  IconShield, 
  IconCheck, 
  IconClock, 
  IconCup, 
  IconSparkles,
  IconCompass
} from '@/components/icons'
import FameDrinkLogo from '@/components/FameDrinkLogo'

interface Props {
  initialCustomers: CustomerSummary[]
  stats: {
    totalCustomers: number
    rewardEligibleCount: number
    activeWeeklyCount: number
    withPhoneCount: number
  }
}

export default function CustomerManagementClient({ initialCustomers, stats }: Props) {
  const [customers, setCustomers] = useState<CustomerSummary[]>(initialCustomers)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'reward' | 'weekly' | 'phone'>('all')
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null)

  // Modals state
  const [selectedCustomerHistory, setSelectedCustomerHistory] = useState<CustomerSummary | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCustName, setNewCustName] = useState('')
  const [newCustPhone, setNewCustPhone] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Filter customers
  const filteredCustomers = customers.filter((c) => {
    const q = search.trim().toLowerCase()
    const matchSearch =
      !q ||
      c.displayName.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q))

    if (!matchSearch) return false

    if (activeTab === 'reward') return c.qualifiesForReward
    if (activeTab === 'weekly') return c.sevenDayDrinks > 0
    if (activeTab === 'phone') return !!c.phone
    return true
  })

  // Barista Action: Record +1 Drink
  const handleAddDrink = async (customer: CustomerSummary) => {
    setLoadingId(customer.id)
    const res = await recordManualDrink(customer.id, 'wake-cold-brew')
    setLoadingId(null)

    if (res.success) {
      // Optimistic update
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id !== customer.id) return c
          const newTotal = c.totalDrinks + 1
          const newWeekly = c.sevenDayDrinks + 1
          const newCycle = Math.max(0, newTotal - c.loyaltyClaimed * 10)
          return {
            ...c,
            totalDrinks: newTotal,
            sevenDayDrinks: newWeekly,
            currentCycleDrinks: newCycle,
            qualifiesForReward: newCycle >= 10,
            lastVisitedAt: new Date().toISOString(),
            recentDrinks: [
              {
                productName: 'Cold Brew Ủ Lạnh 12H',
                category: 'WAKE',
                caffeine: 150,
                consumedAt: new Date().toISOString(),
              },
              ...c.recentDrinks,
            ],
          }
        })
      )
      showToast(`+1 Ly thành công cho khách ${customer.displayName}!`)
    } else {
      showToast(res.message)
    }
  }

  // Barista Action: Claim Reward
  const handleClaimReward = async (customer: CustomerSummary) => {
    if (!confirm(`Xác nhận áp dụng ưu đãi tri ân cho khách hàng: ${customer.displayName}?`)) {
      return
    }

    setLoadingId(customer.id)
    const res = await claimCustomerReward(customer.id)
    setLoadingId(null)

    if (res.success) {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id !== customer.id) return c
          const nextClaimed = c.loyaltyClaimed + 1
          const nextCycle = Math.max(0, c.totalDrinks - nextClaimed * 10)
          return {
            ...c,
            loyaltyClaimed: nextClaimed,
            currentCycleDrinks: nextCycle,
            qualifiesForReward: nextCycle >= 10,
          }
        })
      )
      showToast(res.message)
    } else {
      showToast(res.message)
    }
  }

  // Create Quick Customer
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdding(true)
    const res = await quickCreateCustomer(newCustName, newCustPhone)
    setIsAdding(false)

    if (res.success) {
      showToast(res.message)
      setShowAddModal(false)
      setNewCustName('')
      setNewCustPhone('')
      // Add optimistic customer
      const newC: CustomerSummary = {
        id: `cust_${Date.now()}`,
        displayName: newCustName.trim() || `Khách ${newCustPhone.slice(-4)}`,
        phone: newCustPhone.trim(),
        email: null,
        avatarUrl: null,
        totalDrinks: 0,
        sevenDayDrinks: 0,
        loyaltyClaimed: 0,
        currentCycleDrinks: 0,
        qualifiesForReward: false,
        lastVisitedAt: new Date().toISOString(),
        recentDrinks: [],
      }
      setCustomers([newC, ...customers])
    } else {
      showToast(res.message)
    }
  }

  const copyToClipboard = (phone: string) => {
    navigator.clipboard.writeText(phone)
    setCopiedPhone(phone)
    setTimeout(() => setCopiedPhone(null), 2000)
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs shadow-2xl flex items-center gap-2 border border-amber-300 animate-bounce">
          <IconSparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-amber-400 font-mono">
              FAME DRINK • BARISTA & CASHIER DESK
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Quản Lý Khách Quen & Ưu Đãi
          </h1>
          <p className="text-xs text-muted mt-1">
            Tra cứu SĐT khi nhận đơn quầy/ship, ghi nhận nhanh số ly và kích hoạt ưu đãi tri ân. (Chỉ quán xem được)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-gold text-xs font-bold uppercase tracking-wider py-2.5 px-4 flex items-center gap-2 shrink-0"
          >
            <span>+ Thêm Khách Mới (SĐT)</span>
          </button>
        </div>
      </div>

      {/* Stat Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface p-4 rounded-2xl border border-white/10">
          <span className="text-[10px] text-muted font-mono uppercase">Tổng Khách Quen</span>
          <p className="text-2xl font-black text-white mt-1 font-mono">{customers.length}</p>
          <span className="text-[10px] text-stone-400">Đã lưu hồ sơ</span>
        </div>

        <div className="surface p-4 rounded-2xl border border-amber-400/25 bg-amber-500/5">
          <span className="text-[10px] text-amber-300 font-mono uppercase">Đủ Điều Kiện Ưu Đãi</span>
          <p className="text-2xl font-black text-amber-300 mt-1 font-mono">
            {customers.filter((c) => c.qualifiesForReward).length} Khách
          </p>
          <span className="text-[10px] text-amber-200/80">Sẵn sàng áp dụng tại quầy</span>
        </div>

        <div className="surface p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          <span className="text-[10px] text-emerald-400 font-mono uppercase">Uống Trong 7 Ngày</span>
          <p className="text-2xl font-black text-emerald-400 mt-1 font-mono">
            {customers.filter((c) => c.sevenDayDrinks > 0).length} Khách
          </p>
          <span className="text-[10px] text-stone-400">Ghé tuần này</span>
        </div>

        <div className="surface p-4 rounded-2xl border border-white/10">
          <span className="text-[10px] text-muted font-mono uppercase">Có Số Điện Thoại</span>
          <p className="text-2xl font-black text-white mt-1 font-mono">
            {customers.filter((c) => !!c.phone).length}
          </p>
          <span className="text-[10px] text-stone-400">Tự động nhận diện</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="surface p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-xs">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm nhanh theo Số điện thoại (0908...), Tên khách, hoặc Email..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-stone-900 border border-white/15 text-white text-xs outline-none focus:border-amber-400 font-mono transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: `Tất cả (${customers.length})` },
              { id: 'reward', label: `⭐ Đủ ưu đãi (${customers.filter((c) => c.qualifiesForReward).length})` },
              { id: 'weekly', label: `7 ngày (${customers.filter((c) => c.sevenDayDrinks > 0).length})` },
              { id: 'phone', label: `Có SĐT (${customers.filter((c) => !!c.phone).length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-amber-400 text-stone-950 font-bold shadow-md'
                    : 'bg-white/5 text-muted hover:text-white border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Customer List Table */}
      {filteredCustomers.length === 0 ? (
        <div className="surface p-12 text-center rounded-2xl border border-white/10 space-y-3">
          <p className="text-sm text-stone-300">Không tìm thấy khách hàng nào khớp với tìm kiếm.</p>
          <button
            onClick={() => {
              setSearch('')
              setActiveTab('all')
            }}
            className="text-xs text-amber-400 underline"
          >
            Xóa bộ lọc tìm kiếm
          </button>
        </div>
      ) : (
        <div className="surface rounded-2xl border border-white/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/60 border-b border-white/10 text-muted uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Khách Hàng</th>
                  <th className="py-3 px-4">Số Điện Thoại (SĐT)</th>
                  <th className="py-3 px-4 text-center">7 Ngày Qua</th>
                  <th className="py-3 px-4 text-center">Tổng Tích Lũy</th>
                  <th className="py-3 px-4">Trạng Thái Ưu Đãi (Quán Thấy)</th>
                  <th className="py-3 px-4 text-right">Thao Tác Barista</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCustomers.map((cust) => {
                  const isEligible = cust.qualifiesForReward
                  const isLoading = loadingId === cust.id

                  return (
                    <tr
                      key={cust.id}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        isEligible ? 'bg-amber-500/[0.03]' : ''
                      }`}
                    >
                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-stone-800 border border-amber-400/25 flex items-center justify-center text-amber-300 font-bold text-xs uppercase shrink-0">
                            {cust.displayName.charAt(0) || 'F'}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm hover:text-amber-300 transition-colors">
                              {cust.displayName}
                            </p>
                            <p className="text-[11px] text-muted truncate max-w-[160px]">
                              {cust.email || 'Chưa liên kết email'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Phone Number with 1-click copy */}
                      <td className="py-3.5 px-4 font-mono">
                        {cust.phone ? (
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-xs">
                              {cust.phone}
                            </span>
                            <button
                              onClick={() => copyToClipboard(cust.phone!)}
                              className="text-[10px] text-muted hover:text-amber-300 px-1.5 py-0.5 rounded bg-white/5 border border-white/10"
                              title="Sao chép SĐT"
                            >
                              {copiedPhone === cust.phone ? '✓ Đã chép' : 'Chép'}
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-stone-500 italic">
                            Chưa lưu SĐT
                          </span>
                        )}
                      </td>

                      {/* 7-Day Frequency */}
                      <td className="py-3.5 px-4 text-center font-mono">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                            cust.sevenDayDrinks > 0
                              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                              : 'text-stone-500'
                          }`}
                        >
                          {cust.sevenDayDrinks} ly
                        </span>
                      </td>

                      {/* Total Drinks */}
                      <td className="py-3.5 px-4 text-center font-mono">
                        <span className="text-white font-bold text-sm">
                          {cust.totalDrinks}
                        </span>
                        <span className="text-[10px] text-muted block">ly đã uống</span>
                      </td>

                      {/* Loyalty Privilege Status (Visible to store only) */}
                      <td className="py-3.5 px-4">
                        {isEligible ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400/15 border border-amber-400/40 text-amber-300">
                              <IconSparkles className="w-3.5 h-3.5 text-amber-400" />
                              <span>Đủ điều kiện nhận ưu đãi</span>
                            </span>
                            <p className="text-[10px] text-stone-400 font-mono">
                              Đã tích lũy đủ chu kỳ ({cust.currentCycleDrinks} ly)
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-stone-800 rounded-full h-2 overflow-hidden border border-white/5">
                                <div
                                  className="bg-amber-400 h-full rounded-full"
                                  style={{
                                    width: `${Math.min(100, (cust.currentCycleDrinks / 10) * 100)}%`,
                                  }}
                                />
                              </div>
                              <span className="font-mono text-[11px] text-muted">
                                {cust.currentCycleDrinks}/10 ly
                              </span>
                            </div>
                            <span className="text-[10px] text-stone-500 block">
                              Đã dùng {cust.loyaltyClaimed} lượt ưu đãi trước
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Barista Quick Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* +1 Ly Quick Button */}
                          <button
                            onClick={() => handleAddDrink(cust)}
                            disabled={isLoading}
                            className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-white/10 text-white font-mono text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                            title="Ghi nhận thêm 1 ly cho khách"
                          >
                            <IconCup className="w-3 h-3 text-amber-400" />
                            <span>+1 Ly</span>
                          </button>

                          {/* Claim Reward Button */}
                          {isEligible ? (
                            <button
                              onClick={() => handleClaimReward(cust)}
                              disabled={isLoading}
                              className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-[11px] shadow-md transition-all inline-flex items-center gap-1 animate-pulse"
                            >
                              <IconCheck className="w-3 h-3" />
                              <span>Áp Dụng Ưu Đãi</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setSelectedCustomerHistory(cust)}
                              className="px-2.5 py-1.5 rounded-lg bg-transparent hover:bg-white/5 border border-white/10 text-stone-400 hover:text-white text-[11px]"
                            >
                              Lịch sử
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Drink History Modal */}
      {selectedCustomerHistory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="surface w-full max-w-md p-6 rounded-2xl border border-white/15 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Lịch Sử Uống: {selectedCustomerHistory.displayName}
                </h3>
                <p className="text-xs text-muted font-mono">
                  SĐT: {selectedCustomerHistory.phone || 'Chưa có'} · Tổng {selectedCustomerHistory.totalDrinks} ly
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomerHistory(null)}
                className="text-stone-400 hover:text-white text-sm font-mono p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {selectedCustomerHistory.recentDrinks.length === 0 ? (
                <p className="text-xs text-muted text-center py-4">Chưa có bản ghi đồ uống gần đây.</p>
              ) : (
                selectedCustomerHistory.recentDrinks.map((d, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{d.productName}</p>
                      <span className="text-[10px] font-mono text-amber-400">{d.category} · ~{d.caffeine || 0}mg</span>
                    </div>
                    <span className="text-[11px] font-mono text-muted">
                      {new Date(d.consumedAt).toLocaleDateString('vi-VN')} {new Date(d.consumedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCustomerHistory(null)}
                className="btn btn-ghost text-xs py-2 px-4 border border-white/15"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Customer Quick Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="surface w-full max-w-sm p-6 rounded-2xl border border-amber-400/30 space-y-4 shadow-2xl">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase font-mono tracking-widest">
                FAME DRINK • LƯU HỒ SƠ QUẦY
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">
                Thêm Khách Hàng Nhanh
              </h3>
              <p className="text-xs text-muted leading-relaxed mt-1">
                Lưu Số điện thoại để tự động tích lũy ưu đãi cho khách đặt ship hoặc mua mang đi.
              </p>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-mono uppercase text-muted block mb-1">
                  Số Điện Thoại (Bắt buộc)
                </label>
                <input
                  type="tel"
                  required
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="Ví dụ: 0908 123 456"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-white/15 text-white font-mono text-xs outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-muted block mb-1">
                  Tên Khách Hàng (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="Ví dụ: Anh Quân, Chị Thảo..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-white/15 text-white text-xs outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-ghost text-xs py-2 px-3 border border-white/15"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="btn btn-gold text-xs font-bold uppercase tracking-wider py-2 px-4"
                >
                  {isAdding ? 'Đang lưu...' : 'Lưu Khách Hàng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
