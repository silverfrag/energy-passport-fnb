import type { DrinkCategory } from '@/types'

export const DRINK_IMAGES: Record<string, string> = {
  'wake-cold-brew': '/images/drinks/wake-cold-brew.jpg',
  'wake-americano': '/images/drinks/wake-cold-brew.jpg',
  'focus-matcha-latte': '/images/drinks/focus-matcha-latte.jpg',
  'focus-matcha-espresso': '/images/drinks/focus-matcha-latte.jpg',
  'refresh-peach-tea': '/images/drinks/refresh-fruit-tea.jpg',
  'refresh-lychee-mint': '/images/drinks/refresh-fruit-tea.jpg',
}

export const DRINK_METADATA: Record<string, {
  tastingNotes: string[]
  origin: string
  brewing: string
  bestTime: string
  servingTemp: string
}> = {
  'wake-cold-brew': {
    tastingNotes: ['Socola đen', 'Hạt phỉ nướng', 'Hậu vị ngọt caramel'],
    origin: 'Cầu Đất, Đà Lạt (1.600m)',
    brewing: 'Ủ chậm lạnh 12-16 giờ',
    bestTime: '07:30 - 11:30 Sáng',
    servingTemp: 'Phục vụ đá lạnh 4°C',
  },
  'wake-americano': {
    tastingNotes: ['Cacao thơm nồng', 'Hương hoa cam', 'Vị đắng sạch'],
    origin: 'Arabica Bourbon & Typica',
    brewing: 'Double Shot Espresso pha nước suối khoáng nóng',
    bestTime: '07:00 - 10:00 Sáng',
    servingTemp: 'Nóng 75°C hoặc Đá viên',
  },
  'focus-matcha-latte': {
    tastingNotes: ['Umami tròn trịa', 'Cỏ ngọt tươi', 'Sữa yến mạch ngậy dịu'],
    origin: 'Ceremonial Grade, Uji, Kyoto',
    brewing: 'Đánh chổi tre Chasen thủ công 80°C',
    bestTime: '10:00 - 15:30 Chiều',
    servingTemp: 'Ấm nhẹ hoặc Đá lạnh',
  },
  'focus-matcha-espresso': {
    tastingNotes: ['Lớp bọt kem', 'Matcha chát thanh', 'Espresso nồng nàn'],
    origin: 'Uji Matcha × Arabica Cầu Đất',
    brewing: 'Phân tầng Layered Craft',
    bestTime: '13:00 - 16:00 Chiều',
    servingTemp: 'Phục vụ lạnh phân tầng',
  },
  'refresh-peach-tea': {
    tastingNotes: ['Đào mật chín', 'Hương hoa mộc', 'Bạc hà sủi bọt'],
    origin: 'Oolong Tứ Quý Mộc Châu',
    brewing: 'Ủ lạnh Cold-steep 8 giờ cùng đào tươi',
    bestTime: '14:00 - 18:00 Chiều',
    servingTemp: 'Đá tuyết sủi tăm',
  },
  'refresh-lychee-mint': {
    tastingNotes: ['Vải thiều ngọt dịu', 'Bạc hà the mát', 'Soda khoáng'],
    origin: 'Vải Lục Ngạn & Thảo mộc tươi',
    brewing: 'Chiết xuất ép lạnh phối khoáng có ga',
    bestTime: '14:30 - 19:00 Chiều/Tối',
    servingTemp: 'Đá tinh khiết sủi bọt',
  },
}

export const CATEGORY_DEFAULT_IMAGE: Record<DrinkCategory, string> = {
  WAKE: '/images/drinks/wake-cold-brew.jpg',
  FOCUS: '/images/drinks/focus-matcha-latte.jpg',
  REFRESH: '/images/drinks/refresh-fruit-tea.jpg',
}

export function getProductImage(slug?: string | null, category?: DrinkCategory): string {
  if (slug && DRINK_IMAGES[slug]) {
    return DRINK_IMAGES[slug]
  }
  if (category && CATEGORY_DEFAULT_IMAGE[category]) {
    return CATEGORY_DEFAULT_IMAGE[category]
  }
  return '/images/drinks/wake-cold-brew.jpg'
}

export interface CategoryInfo {
  id: DrinkCategory
  label: string
  customerGoal: string
  subtitle: string
  tagline: string
  desc: string
  color: string
  lightColor: string
  borderColor: string
  gradientClass: string
  glowClass: string
  defaultDrinkName: string
  defaultDrinkPrice: string
  defaultCaffeine: string
}

export const CATEGORY_DETAILS: Record<DrinkCategory, CategoryInfo> = {
  WAKE: {
    id: 'WAKE',
    label: 'WAKE',
    customerGoal: 'Tỉnh táo hơn',
    subtitle: 'Khởi động & Nạp năng lượng',
    tagline: 'Khai mở năng lượng tức thì',
    desc: 'Cà phê đặc sản Arabica Cầu Đất ủ lạnh 12h, hàm lượng caffeine chuẩn mực giúp bạn bật dậy và bắt đầu ngày mới tràn đầy sức sống.',
    color: 'var(--color-wake)',
    lightColor: 'rgba(255, 107, 53, 0.08)',
    borderColor: 'rgba(255, 107, 53, 0.25)',
    gradientClass: 'gradient-wake',
    glowClass: 'glow-wake',
    defaultDrinkName: 'Cold Brew Ủ Lạnh 12H',
    defaultDrinkPrice: '55.000₫',
    defaultCaffeine: '~150mg',
  },
  FOCUS: {
    id: 'FOCUS',
    label: 'FOCUS',
    customerGoal: 'Tập trung ổn định',
    subtitle: 'Làm việc sâu & Bền bỉ',
    tagline: 'Duy trì sự tập trung êm ái',
    desc: 'Matcha Ceremonial Uji chuẩn Kyoto dồi dào L-theanine tự nhiên, giữ trạng thái làm việc sâu (Deep Work) tĩnh tại, không gây say hay bồn chồn.',
    color: 'var(--color-focus)',
    lightColor: 'rgba(45, 122, 79, 0.08)',
    borderColor: 'rgba(45, 122, 79, 0.25)',
    gradientClass: 'gradient-focus',
    glowClass: 'glow-focus',
    defaultDrinkName: 'Matcha Latte Ceremonial',
    defaultDrinkPrice: '65.000₫',
    defaultCaffeine: '~70mg',
  },
  REFRESH: {
    id: 'REFRESH',
    label: 'REFRESH',
    customerGoal: 'Thư giãn / Làm mới',
    subtitle: 'Hạ nhiệt & Thư thái',
    tagline: 'Làm mới tinh thần & Xoa dịu căng thẳng',
    desc: 'Trà Oolong cao sơn kết hợp thảo mộc trái cây tươi mát, thanh lọc vị giác, phục hồi sự sảng khoái nhẹ nhàng giữa nhịp độ công việc dồn dập.',
    color: 'var(--color-refresh)',
    lightColor: 'rgba(74, 144, 217, 0.08)',
    borderColor: 'rgba(74, 144, 217, 0.25)',
    gradientClass: 'gradient-refresh',
    glowClass: 'glow-refresh',
    defaultDrinkName: 'Peach Oolong Sparkling Tea',
    defaultDrinkPrice: '50.000₫',
    defaultCaffeine: '~30mg',
  },
}
