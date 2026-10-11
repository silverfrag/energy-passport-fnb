import type { DrinkCategory } from '@/types'

export const DRINK_IMAGES: Record<string, string> = {
  // WAKE (8 Cà phê)
  'ca-phe-sot-biscoff': '/images/drinks/ca-phe-sot-biscoff.jpg',
  'ca-phe-kem-deo-buon-me': '/images/drinks/ca-phe-kem-deo-buon-me.jpg',
  'ca-phe-sua-tuoi-suong-sao': '/images/drinks/ca-phe-sua-tuoi-suong-sao.jpg',
  'ca-phe-caramel-kem-muoi': '/images/drinks/ca-phe-caramel-kem-muoi.jpg',
  'ca-phe-cot-dua': '/images/drinks/ca-phe-cot-dua.jpg',
  'bac-siu': '/images/drinks/bac-siu.jpg',
  'ca-phe-sua': '/images/drinks/ca-phe-sua.jpg',
  'ca-phe-den': '/images/drinks/ca-phe-den.jpg',

  // FOCUS (8 Matcha)
  'matcha-caramel': '/images/drinks/matcha-caramel.jpg',
  'matcha-dua-non': '/images/drinks/matcha-dua-non.jpg',
  'matcha-cookie-kem-deo': '/images/drinks/matcha-cookie-kem-deo.jpg',
  'matcha-xoai-sua': '/images/drinks/matcha-xoai-sua.jpg',
  'matcha-dau-sua': '/images/drinks/matcha-dau-sua.jpg',
  'matcha-coldwhisk': '/images/drinks/matcha-coldwhisk.jpg',
  'coco-matcha': '/images/drinks/coco-matcha.jpg',
  'matcha-latte': '/images/drinks/matcha-latte.jpg',

  // REFRESH (16 Trà Trái Cây)
  'tra-buoi': '/images/drinks/tra-buoi.jpg',
  'tra-cam-quyt': '/images/drinks/tra-cam-quyt.jpg',
  'tra-vai-hoa-hong': '/images/drinks/tra-vai-hoa-hong.jpg',
  'tra-luu-do-habicus': '/images/drinks/tra-luu-do-habicus.jpg',
  'tra-chanh-day-nhiet-doi': '/images/drinks/tra-chanh-day-nhiet-doi.jpg',
  'tra-dua-luoi': '/images/drinks/tra-dua-luoi.jpg',
  'tra-dao-cam-sa': '/images/drinks/tra-dao-cam-sa.jpg',
  'tra-tac': '/images/drinks/tra-tac.jpg',
  'tra-mang-cau-tuoi': '/images/drinks/tra-mang-cau-tuoi.jpg',
  'tra-chanh-day-chom-chom': '/images/drinks/tra-chanh-day-chom-chom.jpg',
  'tra-dao-luu-do': '/images/drinks/tra-dao-luu-do.jpg',
  'tra-xoai-yakult': '/images/drinks/tra-xoai-yakult.jpg',
  'tra-me': '/images/drinks/tra-me.jpg',
  'tra-dau': '/images/drinks/tra-dau.jpg',
  'tra-viet-quat': '/images/drinks/tra-viet-quat.jpg',
  'tra-dua-hau-oi-hong': '/images/drinks/tra-dua-hau-oi-hong.jpg',

  // Backward compatibility aliases
  'wake-cold-brew': '/images/drinks/ca-phe-sot-biscoff.jpg',
  'wake-americano': '/images/drinks/ca-phe-den.jpg',
  'focus-matcha-latte': '/images/drinks/matcha-latte.jpg',
  'focus-matcha-espresso': '/images/drinks/matcha-coldwhisk.jpg',
  'refresh-peach-tea': '/images/drinks/tra-dao-cam-sa.jpg',
  'refresh-lychee-mint': '/images/drinks/tra-vai-hoa-hong.jpg',
}

export const DRINK_METADATA: Record<string, {
  tastingNotes: string[]
  origin: string
  brewing: string
  bestTime: string
  servingTemp: string
}> = {
  'ca-phe-sot-biscoff': {
    tastingNotes: ['Sốt bánh Biscoff', 'Vụn quy giòn tan', 'Cà phê nguyên chất đậm đà'],
    origin: 'Cà phê Buôn Mê & Lotus Biscoff',
    brewing: 'Pha máy Espresso phối sốt caramel đun chậm',
    bestTime: '07:30 - 11:30 Sáng',
    servingTemp: 'Đá viên mát lạnh',
  },
  'ca-phe-kem-deo-buon-me': {
    tastingNotes: ['Cốt Robusta đậm đà', 'Kem dẻo mịn béo', 'Hậu vị ngọt sâu'],
    origin: 'Robusta mộc Buôn Ma Thuột',
    brewing: 'Pha phin truyền thống phối kem dẻo tươi',
    bestTime: '07:00 - 11:00 Sáng',
    servingTemp: 'Đá lạnh phân tầng',
  },
  'ca-phe-caramel-kem-muoi': {
    tastingNotes: ['Kem muối biển béo ngậy', 'Caramel ngọt đắng', 'Cà phê đậm vị'],
    origin: 'Cà phê Tây Nguyên tuyển chọn',
    brewing: 'Đánh foam kem muối biển tươi thủ công',
    bestTime: '08:00 - 14:00',
    servingTemp: 'Phục vụ đá lạnh 4°C',
  },
  'coco-matcha': {
    tastingNotes: ['Matcha Uji thơm mát', 'Cốt dừa béo bùi', 'Hương hoa ngọt dịu'],
    origin: 'Matcha cao cấp & Cốt dừa Bến Tre',
    brewing: 'Đánh chổi tre Chasen thủ công 80°C',
    bestTime: '09:00 - 15:30 Chiều',
    servingTemp: 'Đá lạnh phân tầng',
  },
  'matcha-cookie-kem-deo': {
    tastingNotes: ['Vụn Oreo giòn tan', 'Lớp kem dẻo đặc quánh', 'Matcha đậm vị'],
    origin: 'Matcha Uji thượng hạng',
    brewing: 'Ủ lạnh và đánh bông kem dẻo',
    bestTime: '13:00 - 17:00 Chiều',
    servingTemp: 'Đá tuyết mát lạnh',
  },
  'matcha-coldwhisk': {
    tastingNotes: ['Foam matcha dày mịn', 'Umami thanh khiết', 'Diệp lục nguyên bản'],
    origin: 'Matcha Ceremonial Uji, Kyoto',
    brewing: 'Cold-whisk lạnh tốc độ cao',
    bestTime: '08:30 - 16:00',
    servingTemp: 'Lạnh 2°C sủi bọt',
  },
  'tra-dua-hau-oi-hong': {
    tastingNotes: ['Dưa hấu mọng nước', 'Ổi xá lị hồng ngát hương', 'Trà lài thanh mát'],
    origin: 'Trái cây tươi Đà Nẵng & Trà Lài cao sơn',
    brewing: 'Ép lạnh tươi trong ngày',
    bestTime: '11:00 - 18:00 Trưa/Chiều',
    servingTemp: 'Đá tuyết sảng khoái',
  },
  'tra-dao-cam-sa': {
    tastingNotes: ['Đào miếng giòn ngọt', 'Cam vàng mọng nước', 'Sả chanh thơm nồng'],
    origin: 'Đào mật & Cam sành tươi',
    brewing: 'Ủ trà Oolong ngâm sả tươi chiết xuất chậm',
    bestTime: '13:00 - 18:00 Chiều',
    servingTemp: 'Đá viên tinh khiết',
  },
  'tra-mang-cau-tuoi': {
    tastingNotes: ['Thịt mãng cầu dai giòn', 'Chua ngọt bùng nổ', 'Trà lài thanh tao'],
    origin: 'Mãng cầu xiêm Đắk Lắk',
    brewing: 'Xé tươi ngào đường phèn phối trà hoa lài',
    bestTime: '12:00 - 19:00 Chiều/Tối',
    servingTemp: 'Đá lạnh tuyết',
  },
}

export const CATEGORY_DEFAULT_IMAGE: Record<DrinkCategory, string> = {
  WAKE: '/images/drinks/ca-phe-sot-biscoff.jpg',
  FOCUS: '/images/drinks/coco-matcha.jpg',
  REFRESH: '/images/drinks/tra-dua-hau-oi-hong.jpg',
}

export function getProductImage(slug?: string | null, category?: DrinkCategory): string {
  if (slug) {
    if (DRINK_IMAGES[slug]) {
      return DRINK_IMAGES[slug]
    }
    // direct fallback to slug.jpg if exists in drinks folder
    return `/images/drinks/${slug}.jpg`
  }
  if (category && CATEGORY_DEFAULT_IMAGE[category]) {
    return CATEGORY_DEFAULT_IMAGE[category]
  }
  return '/images/drinks/ca-phe-sot-biscoff.jpg'
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
    desc: 'Cà phê đặc sản Fame Drink đậm đà phối hợp sốt Biscoff, kem dẻo Buôn Mê, cốt dừa sánh mịn giúp bạn bật dậy và tràn đầy sinh lực.',
    color: 'var(--color-wake)',
    lightColor: 'rgba(255, 107, 53, 0.08)',
    borderColor: 'rgba(255, 107, 53, 0.25)',
    gradientClass: 'gradient-wake',
    glowClass: 'glow-wake',
    defaultDrinkName: 'Cà Phê Sốt Biscoff',
    defaultDrinkPrice: '31.000₫',
    defaultCaffeine: '~120mg',
  },
  FOCUS: {
    id: 'FOCUS',
    label: 'FOCUS',
    customerGoal: 'Tập trung ổn định',
    subtitle: 'Làm việc sâu & Bền bỉ',
    tagline: 'Duy trì sự tập trung êm ái',
    desc: 'Matcha cao cấp đánh bọt mịn phối kem dẻo, cốt dừa, hoa quả dồi dào L-theanine tự nhiên, giữ trạng thái làm việc sâu (Deep Work) tĩnh tại bền bỉ.',
    color: 'var(--color-focus)',
    lightColor: 'rgba(45, 122, 79, 0.08)',
    borderColor: 'rgba(45, 122, 79, 0.25)',
    gradientClass: 'gradient-focus',
    glowClass: 'glow-focus',
    defaultDrinkName: 'Coco Matcha',
    defaultDrinkPrice: '40.000₫',
    defaultCaffeine: '~65mg',
  },
  REFRESH: {
    id: 'REFRESH',
    label: 'REFRESH',
    customerGoal: 'Thư giãn / Làm mới',
    subtitle: 'Hạ nhiệt & Thư thái',
    tagline: 'Làm mới tinh thần & Xoa dịu căng thẳng',
    desc: 'Trà trái cây nhiệt đới tươi mát thanh lọc vị giác: dưa hấu ổi hồng, mãng cầu tươi, xoài Yakult phục hồi sự sảng khoái nhẹ nhàng.',
    color: 'var(--color-refresh)',
    lightColor: 'rgba(74, 144, 217, 0.08)',
    borderColor: 'rgba(74, 144, 217, 0.25)',
    gradientClass: 'gradient-refresh',
    glowClass: 'glow-refresh',
    defaultDrinkName: 'Trà Dưa Hấu Ổi Hồng',
    defaultDrinkPrice: '40.000₫',
    defaultCaffeine: '~20mg',
  },
}
