import type { DrinkCategory } from '@/types'
import { IconWake, IconFocus, IconRefresh } from '@/components/icons'

const CONFIG: Record<DrinkCategory, { label: string; icon: typeof IconWake; className: string; iconColor: string }> = {
  WAKE: {
    label: 'Cà phê',
    icon: IconWake,
    className: 'border-[#ead4bf] bg-[#fbefdf] text-[#86502b]',
    iconColor: '#86502b',
  },
  FOCUS: {
    label: 'Matcha',
    icon: IconFocus,
    className: 'border-[#d4e1c6] bg-[#eef3e5] text-[#476438]',
    iconColor: '#476438',
  },
  REFRESH: {
    label: 'Trà trái cây',
    icon: IconRefresh,
    className: 'border-[#edd4c3] bg-[#fff0e5] text-[#9a542f]',
    iconColor: '#9a542f',
  },
}

interface CategoryBadgeProps {
  category: DrinkCategory
  showEmoji?: boolean
}

export default function CategoryBadge({ category, showEmoji = true }: CategoryBadgeProps) {
  const config = CONFIG[category]
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${config.className}`}>
      {showEmoji && <Icon className="h-3 w-3 flex-shrink-0" color={config.iconColor} />}
      <span>{config.label}</span>
      <span className="ml-0.5 text-[9px] font-medium tracking-wider opacity-80">{category}</span>
    </span>
  )
}

export function getCategoryColor(category: DrinkCategory): string {
  const colors: Record<DrinkCategory, string> = {
    WAKE: 'var(--color-wake)',
    FOCUS: 'var(--color-focus)',
    REFRESH: 'var(--color-refresh)',
  }
  return colors[category]
}
