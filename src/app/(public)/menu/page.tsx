import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/ProductCard'
import type { DrinkCategory, Product } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'
import { 
  IconWake, 
  IconFocus, 
  IconRefresh, 
  IconCompass, 
  IconPassportCrest,
  IconArrowRight 
} from '@/components/icons'

export const metadata: Metadata = {
  title: 'Thực Đơn Tinh Hoa — Energy Passport Atelier',
  description: 'Thực đơn đồ uống thủ công định hướng trạng thái năng lượng: Cà phê đặc sản, Matcha Uji Kyoto và Trà Oolong thanh nhiệt.',
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

async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true })

    if (error || !data || data.length === 0) return FALLBACK_PRODUCTS
    return data
  } catch {
    return FALLBACK_PRODUCTS
  }
}

const CATEGORIES: {
  id: DrinkCategory
  label: string
  subtitle: string
  icon: (props: { className?: string; color?: string }) => React.ReactElement
  color: string
  tag: string
}[] = [
  { 
    id: 'WAKE', 
    label: 'WAKE ATELIER', 
    subtitle: 'Cà Phê Đặc Sản · Khởi Động Tỉnh Táo', 
    icon: IconWake,
    color: 'var(--color-wake)',
    tag: 'Tác động nhanh · 120-150mg Caffeine'
  },
  { 
    id: 'FOCUS', 
    label: 'FOCUS ATELIER', 
    subtitle: 'Ceremonial Matcha · Tập Trung Sâu 4 Giờ', 
    icon: IconFocus,
    color: 'var(--color-focus)',
    tag: 'L-Theanine êm ái · 70-110mg Caffeine'
  },
  { 
    id: 'REFRESH', 
    label: 'REFRESH ATELIER', 
    subtitle: 'Trà Oolong Cao Sơn · Thanh Lọc & Giải Nhiệt', 
    icon: IconRefresh,
    color: 'var(--color-refresh)',
    tag: 'Thư giãn tinh thần · 0-30mg Caffeine'
  },
]

export default async function MenuPage() {
  const products = await getProducts()

  return (
    <div className="w-full mx-auto max-w-6xl px-4 sm:px-8 py-10 fade-in space-y-12">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-[10px] font-bold tracking-[0.2em] uppercase text-amber-300 font-mono">
          <IconPassportCrest className="w-3.5 h-3.5 text-amber-400" color="#D4AF37" />
          <span>THỰC ĐƠN THỦ CÔNG • CHUẨN ĐỘ COGNITIVE</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Thực Đơn Tinh Tuyển
        </h1>

        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          Mỗi ly nước được định hình dựa trên mục tiêu sinh học: nạp năng lượng bứt phá (WAKE), duy trì dòng chảy tập trung (FOCUS) hoặc tái tạo sự sảng khoái (REFRESH).
        </p>

        <div className="pt-2 flex justify-center">
          <Link
            href="/check-in"
            className="btn btn-gold text-xs font-bold uppercase tracking-wider py-2.5 px-6 inline-flex items-center gap-2 shadow-xl"
          >
            <IconCompass className="w-4 h-4" />
            <span>Check-in Nhận Gợi Ý Theo Cảm Xúc</span>
          </Link>
        </div>
      </div>

      {/* Category Sections */}
      <div className="space-y-16">
        {CATEGORIES.map((cat) => {
          const catProducts = products.filter((p) => p.category === cat.id)
          const IconComponent = cat.icon

          return (
            <section key={cat.id} className="space-y-6">
              {/* Category Atelier Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-4 gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border"
                    style={{
                      background: 'rgba(0,0,0,0.5)',
                      borderColor: cat.color,
                      color: cat.color,
                    }}
                  >
                    <IconComponent className="w-5 h-5" color={cat.color} />
                  </div>
                  <div>
                    <h2
                      className="text-lg sm:text-xl font-black tracking-wider uppercase font-mono"
                      style={{ color: cat.color }}
                    >
                      {cat.label}
                    </h2>
                    <p className="text-xs text-muted mt-0.5">
                      {cat.subtitle}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-stone-400 tracking-wider uppercase self-start sm:self-auto">
                  {cat.tag}
                </span>
              </div>

              {catProducts.length === 0 ? (
                <div className="surface p-8 text-center text-xs text-muted rounded-xl">
                  Chưa có sản phẩm trong nhóm này.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {catProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
