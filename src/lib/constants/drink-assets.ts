import type { DrinkCategory, Product } from '@/types'

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

export interface DrinkCopy {
  summary: string
  description: string
  tastingNotes: string[]
}

// Public copy describes flavor only. Origin, caffeine and preparation claims
// require verified recipe data before they are published.
export const DRINK_METADATA: Record<string, DrinkCopy> = {
  "ca-phe-sot-biscoff": {
    "summary": "Cà phê đậm vị, Biscoff thơm ngọt.",
    "description": "Vị đậm của cà phê kết hợp hương bánh quy Biscoff thơm ngọt và béo nhẹ.",
    "tastingNotes": [
      "Đậm vị cà phê",
      "Biscoff thơm ngọt"
    ]
  },
  "ca-phe-kem-deo-buon-me": {
    "summary": "Cà phê đậm đà cùng kem dẻo béo mịn.",
    "description": "Cà phê đậm đà kết hợp lớp kem dẻo mềm mịn, dành cho gu thích vị cà phê cùng chút béo ngọt.",
    "tastingNotes": [
      "Đậm đà",
      "Kem dẻo béo mịn"
    ]
  },
  "ca-phe-sua-tuoi-suong-sao": {
    "summary": "Cà phê, sữa tươi và sương sáo mềm.",
    "description": "Cà phê thơm đậm, sữa tươi béo nhẹ và sương sáo mềm tạo nên một lựa chọn nhiều vị trong cùng một ly.",
    "tastingNotes": [
      "Thơm vị cà phê",
      "Sữa béo nhẹ",
      "Sương sáo mềm"
    ]
  },
  "ca-phe-caramel-kem-muoi": {
    "summary": "Caramel ngọt thơm, kem muối béo nhẹ.",
    "description": "Cà phê đậm vị kết hợp caramel thơm ngọt và lớp kem muối béo nhẹ, có chút mặn cân bằng vị ngọt.",
    "tastingNotes": [
      "Caramel",
      "Kem muối",
      "Đậm vị cà phê"
    ]
  },
  "ca-phe-cot-dua": {
    "summary": "Cà phê đậm vị, cốt dừa thơm béo.",
    "description": "Vị đậm của cà phê quyện cùng cốt dừa thơm béo, với hương dừa rõ trong từng ngụm.",
    "tastingNotes": [
      "Cà phê đậm",
      "Dừa thơm béo"
    ]
  },
  "bac-siu": {
    "summary": "Nhiều vị sữa, cà phê đắng nhẹ.",
    "description": "Bạc sỉu thiên về vị sữa ngọt béo, điểm thêm hương cà phê và vị đắng nhẹ.",
    "tastingNotes": [
      "Sữa ngọt béo",
      "Cà phê nhẹ"
    ]
  },
  "ca-phe-sua": {
    "summary": "Cà phê đậm đà, sữa ngọt béo.",
    "description": "Cà phê kết hợp sữa ngọt béo, một lựa chọn quen thuộc cho gu thích vị cà phê đậm và hậu vị sữa.",
    "tastingNotes": [
      "Đậm đà",
      "Sữa ngọt béo"
    ]
  },
  "ca-phe-den": {
    "summary": "Hương cà phê rõ, vị đắng đậm.",
    "description": "Cà phê đen với hương cà phê rõ và vị đắng đậm, dành cho gu thích cà phê không sữa.",
    "tastingNotes": [
      "Vị đắng đậm",
      "Không sữa"
    ]
  },
  "matcha-caramel": {
    "summary": "Matcha chát nhẹ, caramel thơm ngọt.",
    "description": "Vị chát nhẹ của matcha kết hợp caramel thơm ngọt, tạo nên hương vị trà xanh cùng nét béo ngọt.",
    "tastingNotes": [
      "Matcha chát nhẹ",
      "Caramel thơm ngọt"
    ]
  },
  "matcha-dua-non": {
    "summary": "Matcha cùng vị dừa non thanh nhẹ.",
    "description": "Hương matcha kết hợp vị dừa thanh nhẹ và dừa non mềm, bùi.",
    "tastingNotes": [
      "Vị trà xanh",
      "Dừa non mềm bùi"
    ]
  },
  "matcha-cookie-kem-deo": {
    "summary": "Matcha, bánh quy và kem dẻo béo mịn.",
    "description": "Vị matcha kết hợp bánh quy thơm và lớp kem dẻo béo mịn, dành cho gu thích đồ uống ngọt béo.",
    "tastingNotes": [
      "Vị trà xanh",
      "Bánh quy",
      "Kem dẻo"
    ]
  },
  "matcha-xoai-sua": {
    "summary": "Matcha, xoài thơm ngọt và sữa béo nhẹ.",
    "description": "Matcha kết hợp vị xoài thơm ngọt và sữa béo nhẹ, có cả vị trà xanh lẫn hương trái cây.",
    "tastingNotes": [
      "Xoài thơm ngọt",
      "Sữa béo nhẹ",
      "Matcha"
    ]
  },
  "matcha-dau-sua": {
    "summary": "Matcha, dâu chua ngọt và sữa.",
    "description": "Vị dâu chua ngọt kết hợp sữa và matcha, tạo nên ly nước có vị trà xanh cùng hương dâu.",
    "tastingNotes": [
      "Dâu chua ngọt",
      "Sữa béo",
      "Matcha"
    ]
  },
  "matcha-coldwhisk": {
    "summary": "Hương matcha rõ, lớp bọt mịn.",
    "description": "Matcha Coldwhisk có hương trà xanh rõ, vị chát nhẹ và lớp bọt mịn.",
    "tastingNotes": [
      "Vị trà xanh",
      "Chát nhẹ",
      "Bọt mịn"
    ]
  },
  "coco-matcha": {
    "summary": "Matcha đậm vị cùng cốt dừa thơm béo.",
    "description": "Hương matcha đậm vị kết hợp cốt dừa thơm béo, dành cho gu thích trà xanh và dừa.",
    "tastingNotes": [
      "Matcha đậm vị",
      "Dừa thơm béo"
    ]
  },
  "matcha-latte": {
    "summary": "Matcha chát nhẹ quyện sữa béo.",
    "description": "Matcha Latte kết hợp vị trà xanh chát nhẹ với sữa béo, cân bằng giữa vị trà và vị sữa.",
    "tastingNotes": [
      "Trà xanh chát nhẹ",
      "Sữa béo"
    ]
  },
  "tra-buoi": {
    "summary": "Vị bưởi chua ngọt trên nền trà.",
    "description": "Hương bưởi cùng vị chua ngọt kết hợp với trà, một lựa chọn cho gu thích vị trái cây có chút đắng nhẹ.",
    "tastingNotes": [
      "Hương bưởi",
      "Chua ngọt",
      "Đắng nhẹ"
    ]
  },
  "tra-cam-quyt": {
    "summary": "Cam quýt thơm, vị chua ngọt.",
    "description": "Trà kết hợp hương cam quýt cùng vị chua ngọt quen thuộc của nhóm trái cây có múi.",
    "tastingNotes": [
      "Hương cam quýt",
      "Chua ngọt"
    ]
  },
  "tra-vai-hoa-hong": {
    "summary": "Vải ngọt dịu, hương hoa hồng.",
    "description": "Vị vải ngọt dịu kết hợp với hương hoa hồng trên nền trà.",
    "tastingNotes": [
      "Vải ngọt dịu",
      "Hương hoa hồng"
    ]
  },
  "tra-luu-do-habicus": {
    "summary": "Lựu đỏ và hibiscus chua nhẹ.",
    "description": "Vị lựu đỏ kết hợp hibiscus chua nhẹ, với sắc đỏ đặc trưng.",
    "tastingNotes": [
      "Lựu đỏ",
      "Hibiscus",
      "Chua nhẹ"
    ]
  },
  "tra-chanh-day-nhiet-doi": {
    "summary": "Chanh dây thơm, chua ngọt rõ vị.",
    "description": "Hương chanh dây nổi bật cùng vị chua ngọt trên nền trà, dành cho gu thích vị trái cây nhiệt đới.",
    "tastingNotes": [
      "Hương chanh dây",
      "Chua ngọt"
    ]
  },
  "tra-dua-luoi": {
    "summary": "Hương dưa lưới, vị ngọt dịu.",
    "description": "Trà kết hợp hương dưa lưới và vị ngọt dịu, dành cho gu thích hương trái cây nhẹ nhàng.",
    "tastingNotes": [
      "Dưa lưới",
      "Ngọt dịu"
    ]
  },
  "tra-dao-cam-sa": {
    "summary": "Đào ngọt, cam chua nhẹ và hương sả.",
    "description": "Vị đào ngọt kết hợp cam chua nhẹ cùng hương sả, một tổ hợp hương vị quen thuộc trên nền trà.",
    "tastingNotes": [
      "Đào ngọt",
      "Cam chua nhẹ",
      "Hương sả"
    ]
  },
  "tra-tac": {
    "summary": "Hương tắc thơm, chua ngọt quen thuộc.",
    "description": "Trà kết hợp vị tắc chua và ngọt, với hương tắc thơm rõ.",
    "tastingNotes": [
      "Hương tắc",
      "Chua ngọt"
    ]
  },
  "tra-mang-cau-tuoi": {
    "summary": "Mãng cầu chua ngọt, có thịt quả.",
    "description": "Vị trà kết hợp mãng cầu chua ngọt và phần thịt quả mềm.",
    "tastingNotes": [
      "Mãng cầu",
      "Chua ngọt",
      "Thịt quả mềm"
    ]
  },
  "tra-chanh-day-chom-chom": {
    "summary": "Chanh dây chua, chôm chôm ngọt.",
    "description": "Trà kết hợp hương chanh dây chua cùng vị chôm chôm ngọt, tạo nên hai vị trái cây trong một ly.",
    "tastingNotes": [
      "Chanh dây",
      "Chôm chôm",
      "Chua ngọt"
    ]
  },
  "tra-dao-luu-do": {
    "summary": "Đào thơm ngọt cùng vị lựu đỏ.",
    "description": "Trà kết hợp hương đào thơm ngọt với vị lựu đỏ, có vị chua ngọt nhẹ.",
    "tastingNotes": [
      "Hương đào",
      "Lựu đỏ",
      "Chua ngọt nhẹ"
    ]
  },
  "tra-xoai-yakult": {
    "summary": "Xoài thơm ngọt, Yakult chua dịu.",
    "description": "Vị xoài thơm ngọt kết hợp vị chua dịu đặc trưng của Yakult.",
    "tastingNotes": [
      "Xoài thơm",
      "Yakult chua dịu"
    ]
  },
  "tra-me": {
    "summary": "Vị me chua ngọt đậm đà.",
    "description": "Trà Me có vị me chua ngọt đậm đà và hương me đặc trưng.",
    "tastingNotes": [
      "Hương me",
      "Chua ngọt đậm"
    ]
  },
  "tra-dau": {
    "summary": "Hương dâu thơm, vị chua ngọt.",
    "description": "Trà kết hợp hương dâu cùng vị chua ngọt, dành cho gu thích vị trái cây quen thuộc.",
    "tastingNotes": [
      "Hương dâu",
      "Chua ngọt"
    ]
  },
  "tra-viet-quat": {
    "summary": "Việt quất chua ngọt, hương quả mọng.",
    "description": "Trà kết hợp vị việt quất chua ngọt và hương quả mọng đặc trưng.",
    "tastingNotes": [
      "Việt quất",
      "Chua ngọt"
    ]
  },
  "tra-dua-hau-oi-hong": {
    "summary": "Dưa hấu ngọt nhẹ, ổi hồng thơm.",
    "description": "Vị dưa hấu ngọt nhẹ kết hợp hương ổi hồng trên nền trà.",
    "tastingNotes": [
      "Dưa hấu",
      "Hương ổi hồng",
      "Ngọt nhẹ"
    ]
  }
}

export function getPublicProductCopy(product: Pick<Product, 'slug' | 'category'>): DrinkCopy {
  const knownCopy = DRINK_METADATA[product.slug]
  if (knownCopy) return knownCopy

  // Older database/local catalog descriptions can contain unverified claims.
  // New catalog items get neutral copy until their flavor information is reviewed.
  const label = CATEGORY_DETAILS[product.category].label
  return {
    summary: label,
    description: `Một lựa chọn trong nhóm ${label.toLocaleLowerCase('vi-VN')} của Fame Drink. Trao đổi với Fame để biết thêm về hương vị và thành phần.`,
    tastingNotes: [],
  }
}

export const CATEGORY_DEFAULT_IMAGE: Record<DrinkCategory, string> = {
  WAKE: '/images/drinks/ca-phe-sot-biscoff.jpg',
  FOCUS: '/images/drinks/coco-matcha.jpg',
  REFRESH: '/images/drinks/tra-dua-hau-oi-hong.jpg',
}

export function getProductImage(slug?: string | null, category?: DrinkCategory): string {
  if (slug) return DRINK_IMAGES[slug] ?? `/images/drinks/${slug}.jpg`
  if (category) return CATEGORY_DEFAULT_IMAGE[category]
  return CATEGORY_DEFAULT_IMAGE.WAKE
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
    label: 'Cà phê',
    customerGoal: 'Thích vị cà phê',
    subtitle: 'Đậm vị, thơm béo',
    tagline: 'Gu cà phê quen thuộc, thêm chút mới mẻ',
    desc: 'Cà phê đen, cà phê sữa và những kết hợp cùng Biscoff, kem dẻo, caramel hoặc cốt dừa.',
    color: 'var(--color-wake)',
    lightColor: 'rgba(185, 71, 32, 0.08)',
    borderColor: 'rgba(185, 71, 32, 0.25)',
    gradientClass: 'gradient-wake',
    glowClass: 'glow-wake',
    defaultDrinkName: 'Cà Phê Sốt Biscoff',
    defaultDrinkPrice: '31.000₫',
    defaultCaffeine: '',
  },
  FOCUS: {
    id: 'FOCUS',
    label: 'Matcha',
    customerGoal: 'Thích vị trà xanh',
    subtitle: 'Vị trà xanh, béo nhẹ',
    tagline: 'Matcha cùng những hương vị bạn thích',
    desc: 'Matcha kết hợp sữa, caramel, bánh quy, dừa hoặc vị trái cây chua ngọt.',
    color: 'var(--color-focus)',
    lightColor: 'rgba(45, 122, 79, 0.08)',
    borderColor: 'rgba(45, 122, 79, 0.25)',
    gradientClass: 'gradient-focus',
    glowClass: 'glow-focus',
    defaultDrinkName: 'Coco Matcha',
    defaultDrinkPrice: '40.000₫',
    defaultCaffeine: '',
  },
  REFRESH: {
    id: 'REFRESH',
    label: 'Trà trái cây',
    customerGoal: 'Thích vị trái cây',
    subtitle: 'Chua ngọt, thơm hương trái cây',
    tagline: 'Chọn hương trái cây yêu thích',
    desc: 'Trà kết hợp đào, vải, dâu, chanh dây và nhiều hương vị trái cây khác.',
    color: 'var(--color-refresh)',
    lightColor: 'rgba(61, 140, 168, 0.08)',
    borderColor: 'rgba(61, 140, 168, 0.25)',
    gradientClass: 'gradient-refresh',
    glowClass: 'glow-refresh',
    defaultDrinkName: 'Trà Dưa Hấu Ổi Hồng',
    defaultDrinkPrice: '40.000₫',
    defaultCaffeine: '',
  },
}
