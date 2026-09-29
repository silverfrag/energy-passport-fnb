'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { DrinkCategory, ActionStep } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>

function parseSteps(rawSteps: string): ActionStep[] {
  const lines = rawSteps.split('\n').filter((l) => l.trim())
  return lines.map((text, i) => ({ order: i + 1, text: text.trim() }))
}

export async function createMicroAction(
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const slug = formData.get('slug')?.toString().trim().toLowerCase().replace(/\s+/g, '-')
  const category = formData.get('category')?.toString() as DrinkCategory
  const title = formData.get('title')?.toString().trim()
  const durationMinutes = parseInt(formData.get('duration_minutes')?.toString() ?? '5')
  const description = formData.get('description')?.toString()
  const stepsRaw = formData.get('steps')?.toString() ?? ''
  const active = formData.get('active') === 'true'

  if (!slug || !category || !title) {
    return { error: 'Slug, danh mục và tiêu đề là bắt buộc.' }
  }

  const steps = parseSteps(stepsRaw)

  const payload: AnyRecord = { slug, category, title, duration_minutes: durationMinutes, description: description || null, steps, active }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('micro_actions') as any).insert(payload)

  if (error) return { error: error.message }
  redirect('/admin/actions')
}

export async function updateMicroAction(
  id: string,
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const category = formData.get('category')?.toString() as DrinkCategory
  const title = formData.get('title')?.toString().trim()
  const durationMinutes = parseInt(formData.get('duration_minutes')?.toString() ?? '5')
  const description = formData.get('description')?.toString()
  const stepsRaw = formData.get('steps')?.toString() ?? ''
  const active = formData.get('active') === 'true'

  const steps = parseSteps(stepsRaw)

  const payload: AnyRecord = { category, title, duration_minutes: durationMinutes, description: description || null, steps, active }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('micro_actions') as any).update(payload).eq('id', id)

  if (error) return { error: error.message }
  redirect('/admin/actions')
}
