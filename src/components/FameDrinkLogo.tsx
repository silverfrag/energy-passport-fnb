import Link from 'next/link'

interface FameDrinkLogoProps {
  variant?: 'full' | 'compact' | 'icon'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showLink?: boolean
}

export default function FameDrinkLogo({ variant = 'full', size = 'md', className = '', showLink = false }: FameDrinkLogoProps) {
  const sizes = { sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-12 text-base', xl: 'size-16 text-xl' }
  const titles = { sm: 'text-xs', md: 'text-sm', lg: 'text-lg', xl: 'text-2xl' }
  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span aria-hidden="true" className={`${sizes[size]} flex shrink-0 items-center justify-center rounded-full bg-[#b94720] font-black tracking-tight text-white`}>FD<span className="text-[#ffc98f]">.</span></span>
      {variant !== 'icon' && <span className="flex flex-col">
        <span className={`${titles[size]} font-extrabold leading-tight tracking-[0.06em] text-[var(--color-text)]`}>FAME DRINK</span>
        <span className="mt-0.5 text-[9px] font-semibold tracking-[0.12em] text-[var(--color-text-muted)]">TAKEAWAY · GIAO TẬN NƠI</span>
      </span>}
    </span>
  )
  return showLink ? <Link href="/" aria-label="Fame Drink — trang chủ" className="inline-flex">{content}</Link> : content
}
