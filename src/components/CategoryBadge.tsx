import type { DrinkCategory } from '@/types'
import { IconWake, IconFocus, IconRefresh } from '@/components/icons'

const CONFIG: Record<DrinkCategory, { label: string; icon: typeof IconWake; className: string; iconColor: string }> = {
  WAKE: {
    label: 'WAKE',
    icon: IconWake,
    className: 'badge-pill badge-wake',
    iconColor: '#FFA07A',
  },
  FOCUS: {
    label: 'FOCUS',
    icon: IconFocus,
    className: 'badge-pill badge-focus',
    iconColor: '#95D5B2',
  },
  REFRESH: {
    label: 'REFRESH',
    icon: IconRefresh,
    className: 'badge-pill badge-refresh',
    iconColor: '#A0C4E2',
  },
}

interface CategoryBadgeProps {
  category: DrinkCategory
  showEmoji?: boolean
}

export default function CategoryBadge({ category, showEmoji = true }: CategoryBadgeProps) {
  const cfg = CONFIG[category]
  const Icon = cfg.icon

  return (
    <span className={cfg.className}>
      {showEmoji && <Icon className="w-3 h-3 flex-shrink-0" color={cfg.iconColor} />}
      <span>{cfg.label}</span>
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
