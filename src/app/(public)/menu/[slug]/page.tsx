import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CategoryBadge from '@/components/CategoryBadge'
import { getProductImage, DRINK_METADATA } from '@/lib/constants/drink-assets'
import { 
  IconScan, 
  IconCompass, 
  IconShield, 
  IconClock, 
  IconPassportCrest,
  IconArrowRight 
} from '@/components/icons'

interface Props {
  params: Promise<{ slug: string }>
}

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: '1', 
    slug: 'wake-americano', 
    name: 'Americano Double Shot', 
    category: 'WAKE',
    short_description: 'Espresso Arabica Cầu Đất nguyên chất, vị đắng sạch thanh lịch, đánh thức tức thì.',
    description: 'Americano chế tác từ double shot espresso Arabica thượng hạng pha cùng nước khoáng tinh khiết ở nhiệt độ chuẩn xác.',
    price: 45000, 
    caffeine_mg: 120, 
    image_url: '/images/drinks/wake-cold-brew.jpg',
    active: true, 
    featured: true, 
    sort_order: 1, 
    created_at: '', 
    updated_at: '',
  },
  {
    id: '2', 
    slug: 'wake-cold-brew', 
    name: 'Cold Brew Ủ Lạnh 12H', 
    category: 'WAKE',
    short_description: 'Ủ lạnh chậm 12-16 giờ ở 4°C, ngọt hậu tự nhiên không đường, êm ái cho dạ dày.',
    description: 'Cold brew chiết xuất chậm từ hạt Arabica Cầu Đất ở độ cao 1.600m, mang tầng hương socola đen và hạt phỉ nướng đầm ấm.',
    price: 55000, 
    caffeine_mg: 150, 
    image_url: '/images/drinks/wake-cold-brew.jpg',
    active: true, 
    featured: true, 
    sort_order: 2, 
    created_at: '', 
    updated_at: '',
  },
  {
    id: '3', 
    slug: 'focus-matcha-latte', 
    name: 'Matcha Latte Ceremonial', 
    category: 'FOCUS',
    short_description: 'Matcha Uji Kyoto đánh chổi tre thủ công cùng sữa yến mạch béo nhẹ, dồi dào L-theanine.',
    description: 'Bột matcha thượng hạng nhập khẩu trực tiếp từ vùng Uji danh tiếng, kết hợp tỷ lệ L-theanine và caffeine tối ưu cho trạng thái làm việc sâu.',
    price: 65000, 
    caffeine_mg: 70, 
    image_url: '/images/drinks/focus-matcha-latte.jpg',
    active: true, 
    featured: true, 
    sort_order: 1, 
    created_at: '', 
    updated_at: '',
  },
  {
    id: '4', 
    slug: 'focus-matcha-espresso', 
    name: 'Matcha Espresso Layered Dirty', 
    category: 'FOCUS',
    short_description: 'Sự giao thoa giữa vị chát umami thanh tao của matcha và độ nồng đượm của espresso.',
    description: 'Kỹ thuật đổ tầng đặc biệt giữa sữa lạnh, cốt matcha đậm đặc và lớp espresso crema bồng bềnh mang lại cú hích tập trung kép.',
    price: 70000, 
    caffeine_mg: 110, 
    image_url: '/images/drinks/focus-matcha-latte.jpg',
    active: true, 
    featured: false, 
    sort_order: 2, 
    created_at: '', 
    updated_at: '',
  },
  {
    id: '5', 
    slug: 'refresh-peach-tea', 
    name: 'Peach Oolong Sparkling Tea', 
    category: 'REFRESH',
    short_description: 'Trà Oolong Tứ Quý ủ lạnh ngâm đào tươi và bọt khoáng sủi sảng khoái.',
    description: 'Lá trà Oolong Mộc Châu thu hái thủ công, ủ lạnh chiết xuất chậm cùng đào mật tươi tạo hương thơm ngọt ngào không gắt.',
    price: 50000, 
    caffeine_mg: 30, 
    image_url: '/images/drinks/refresh-fruit-tea.jpg',
    active: true, 
    featured: true, 
    sort_order: 1, 
    created_at: '', 
    updated_at: '',
  },
  {
    id: '6', 
    slug: 'refresh-lychee-mint', 
    name: 'Lychee Mint Herbal Sparkler', 
    category: 'REFRESH',
    short_description: 'Vải thiều ngọt dịu phối bạc hà tươi the mát và nước khoáng có ga thanh lọc vị giác.',
    description: 'Thức uống hạ nhiệt hoàn hảo không chứa caffeine nồng, giúp xua tan áp lực và tái tạo sự thư thái trọn vẹn.',
    price: 45000, 
    caffeine_mg: null, 
    image_url: '/images/drinks/refresh-fruit-tea.jpg',
    active: true, 
    featured: false, 
    sort_order: 2, 
    created_at: '', 
    updated_at: '',
  },
]

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single()
    if (data) return data
  } catch { /* fallback */ }
  return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Không tìm thấy thức uống' }
  return {
    title: `${product.name} — Energy Passport Atelier`,
    description: product.short_description ?? product.description ?? '',
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const imageUrl = product.image_url || getProductImage(product.slug, product.category)
  const meta = DRINK_METADATA[product.slug] || {
    tastingNotes: ['Cân bằng hài hòa', 'Hậu vị ngọt thanh'],
    origin: 'Nguyên liệu đặc sản tuyển chọn',
    brewing: 'Chiết xuất thủ công chuẩn nhiệt độ',
    bestTime: '08:00 - 16:00',
    servingTemp: 'Đá viên tinh khiết',
  }

  return (
    <div className="w-full fade-in pb-20">
      {/* Product Hero Photography */}
      <div className="relative h-80 sm:h-[450px] w-full overflow-hidden bg-stone-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-black/20 to-black/50" />
        
        {/* Navigation overlay */}
        <div className="absolute top-5 left-5 z-10">
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-semibold text-white hover:bg-black/90 transition-colors"
          >
            ← Quay lại Thực Đơn
          </Link>
        </div>

        {/* Floating Category Pill */}
        <div className="absolute bottom-5 left-5 z-10 flex items-center gap-2">
          <CategoryBadge category={product.category} showEmoji={false} />
          <span className="text-[10px] font-mono tracking-wider uppercase text-amber-200/90 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/30">
            {meta.origin}
          </span>
        </div>
      </div>

      <div className="w-full mx-auto max-w-2xl px-4 sm:px-6 pt-6 space-y-6">
        {/* Title and Price */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {product.name}
            </h1>
            {product.short_description && (
              <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
                {product.short_description}
              </p>
            )}
          </div>
          {product.price && (
            <span className="text-2xl font-black font-mono text-amber-300 flex-shrink-0">
              {new Intl.NumberFormat('vi-VN').format(product.price)}₫
            </span>
          )}
        </div>

        {/* Tasting Notes Highlight */}
        <div className="p-4 rounded-xl bg-surface border border-white/10 space-y-2">
          <p className="text-[10px] uppercase tracking-wider text-muted font-mono">
            Hương Vị Ghi Nhận (Tasting Notes)
          </p>
          <div className="flex flex-wrap gap-2">
            {meta.tastingNotes.map((note) => (
              <span
                key={note}
                className="px-3 py-1 rounded-full text-xs font-medium bg-amber-400/10 text-amber-200 border border-amber-400/20"
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* Technical Specs Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-surface border border-white/10">
            <p className="text-[10px] uppercase tracking-wider text-muted font-mono">
              Hàm Lượng Caffeine
            </p>
            <p className="text-lg font-black text-white font-mono mt-0.5">
              {product.caffeine_mg !== null ? `~${product.caffeine_mg} mg` : 'Không đáng kể'}
            </p>
            <p className="text-[10px] text-stone-400 mt-1">Đo lường trên mẻ pha</p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface border border-white/10">
            <p className="text-[10px] uppercase tracking-wider text-muted font-mono">
              Thời Điểm Khuyên Dùng
            </p>
            <p className="text-lg font-black text-white font-mono mt-0.5">
              {meta.bestTime}
            </p>
            <p className="text-[10px] text-stone-400 mt-1">{meta.servingTemp}</p>
          </div>
        </div>

        {/* Brewing Story */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
            Quy Cách Chiết Xuất & Nguồn Gốc
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {product.description || product.short_description}
          </p>
          <div className="flex items-center gap-2 text-xs text-amber-300/80 pt-1">
            <IconShield className="w-4 h-4 text-amber-400" color="#D4AF37" />
            <span>{meta.brewing}</span>
          </div>
        </div>

        {/* QR Scan Action / Bind to Passport */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <Link
            href={`/scan/${product.slug}`}
            className="btn btn-gold btn-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider py-3.5 shadow-2xl"
          >
            <IconScan className="w-4 h-4" />
            <span>Quét Mã Trên Ly & Xác Nhận Vào Passport</span>
          </Link>

          <Link
            href="/check-in"
            className="btn btn-ghost btn-full text-xs font-semibold uppercase tracking-wider text-stone-400 hover:text-white border border-white/10 flex items-center justify-center gap-2 py-3"
          >
            <IconCompass className="w-3.5 h-3.5" />
            <span>Check-in Nhận Đề Xuất Phù Hợp Trạng Thái</span>
          </Link>
        </div>

        <p className="text-[11px] text-muted text-center pt-2 font-mono">
          Thông tin caffeine được chuẩn hóa theo mẻ chiết xuất thủ công của Barista.
        </p>
      </div>
    </div>
  )
}
