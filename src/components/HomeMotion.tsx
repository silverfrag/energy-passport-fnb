'use client'

import { useEffect } from 'react'

// Reveal once on entry. Server-rendered content stays visible without JavaScript.
export default function HomeMotion() {
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motion.matches || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('fd-reveal-enter')
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.12 })
    const nodes = document.querySelectorAll('[data-home-reveal]')
    nodes.forEach((node) => observer.observe(node))
    const reduce = () => {
      if (!motion.matches) return
      observer.disconnect()
      nodes.forEach((node) => node.classList.remove('fd-reveal-enter'))
    }
    motion.addEventListener('change', reduce)
    return () => { observer.disconnect(); motion.removeEventListener('change', reduce) }
  }, [])
  return null
}
