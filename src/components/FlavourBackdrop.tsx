import type { Product } from '@/types'

export function getFlavourTheme(product?: Product) {
  if (product?.slug === 'tra-xoai-yakult') return 'mango'
  if (product?.category === 'FOCUS') return 'matcha'
  if (product?.category === 'REFRESH') return 'berry'
  return 'biscoff'
}

function Motif({ theme }: { theme: string }) {
  return <svg viewBox="0 0 900 800" fill="none" aria-hidden="true" focusable="false">
    <ellipse className="fd-flavour-orbit" cx="460" cy="415" rx="288" ry="300" transform="rotate(-24 460 415)" />
    <path className="fd-flavour-contour" d="M-80 690C160 470 420 870 980 495M-80 715C180 485 440 900 980 520M-80 740C200 500 460 930 980 545" />
    {theme === 'biscoff' && <g className="fd-flavour-ingredient"><g transform="translate(650 100) rotate(28)"><rect width="110" height="155" rx="36" /><path d="M55 12C25 55 85 100 55 143M17 45h17m42 68h17" /></g><g transform="translate(140 495) rotate(-32)"><rect width="74" height="105" rx="28" /><path d="M37 10C14 40 58 70 37 95" /></g><path d="m715 560 12-14 14 14-14 15ZM230 165l10-11 11 11-11 12ZM685 345l7-7 8 7-8 9Z" /></g>}
    {theme === 'matcha' && <g className="fd-flavour-ingredient"><path d="M620 225C610 105 707 76 790 92 770 187 714 243 620 225ZM620 225 758 115M670 185l-10-43m51 10 42 3M194 595c-89-20-110-83-99-145 79 15 123 58 99 145Zm0 0-77-116" /><path d="M130 280c-40-15-62-9-79 17m642 290c45-17 81-15 110 6" /></g>}
    {theme === 'berry' && <g className="fd-flavour-ingredient"><path d="M633 131a109 109 0 0 1 167 136ZM650 158a78 78 0 0 1 121 97ZM143 520c-39-44-96-3-84 42 10 36 49 67 80 87 40-25 75-57 78-93 4-46-48-71-74-36Z" /><path d="m652 144 105 110m-86-99 64 99m-72-71 113 60" /><ellipse cx="723" cy="545" rx="9" ry="15" transform="rotate(27 723 545)" /><ellipse cx="751" cy="570" rx="8" ry="13" transform="rotate(-24 751 570)" /><ellipse cx="699" cy="583" rx="7" ry="12" /></g>}
    {theme === 'mango' && <g className="fd-flavour-ingredient"><path d="M626 229C702 78 801 75 819 123 843 188 718 261 626 229ZM651 218c70-111 122-120 148-98M118 545c77-80 132-72 139-33 9 51-71 100-139 82 20-18 31-34 0-49Z" /><circle cx="739" cy="503" r="21" /><circle cx="781" cy="555" r="10" /><circle cx="165" cy="239" r="13" /><path d="m715 154 19 59m14-85 22 57m-96 3 111-27" /></g>}
    <g className="fd-flavour-specks"><circle cx="234" cy="288" r="3" /><circle cx="733" cy="418" r="4" /><circle cx="272" cy="618" r="2" /><circle cx="594" cy="80" r="3" /><path d="M797 359h14m-7-7v14M277 125h12m-6-6v12" /></g>
  </svg>
}

/** One scene recipe, with a distinct palette and ingredient drawing for every flavour. */
export default function FlavourBackdrop({ products, selected }: { products: Product[]; selected: number }) {
  return <div className="fd-flavour-backdrop" aria-hidden="true">{products.map((product, index) => {
    const theme = getFlavourTheme(product)
    return <div key={product.id} className="fd-flavour-panel" data-theme={theme} data-active={selected === index}><div className="fd-flavour-drawing"><Motif theme={theme} /></div></div>
  })}</div>
}
