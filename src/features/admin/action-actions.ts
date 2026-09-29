'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { DrinkCategory, ActionStep } from '@/types'
import {
  saveAdminAction,
  deleteOrToggleAdminAction,
  syncActionsToSupabase,
} from '@/lib/store/catalog-service'

function parseSteps(rawSteps: string): ActionStep[] {
  const lines = rawSteps.split('\n').filter((l) => l.trim())
  return lines.map((text, i) => ({ order: i + 1, text: text.trim() }))
}

export async function createMicroAction(
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
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

  const result = await saveAdminAction({
    slug,
    category,
    title,
    duration_minutes: durationMinutes,
    description: description || null,
    steps,
    active,
  })

  if (!result.success) {
    return { error: result.error || 'Không thể lưu micro-action' }
  }

  revalidatePath('/admin/actions')
  revalidatePath('/recommendation')
  redirect('/admin/actions')
}

export async function updateMicroAction(
  id: string,
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const slug = formData.get('slug')?.toString().trim().toLowerCase().replace(/\s+/g, '-') || id
  const category = formData.get('category')?.toString() as DrinkCategory
  const title = formData.get('title')?.toString().trim()
  const durationMinutes = parseInt(formData.get('duration_minutes')?.toString() ?? '5')
  const description = formData.get('description')?.toString()
  const stepsRaw = formData.get('steps')?.toString() ?? ''
  const active = formData.get('active') === 'true'

  if (!category || !title) {
    return { error: 'Danh mục và tiêu đề là bắt buộc.' }
  }

  const steps = parseSteps(stepsRaw)

  const result = await saveAdminAction({
    id,
    slug,
    category,
    title,
    duration_minutes: durationMinutes,
    description: description || null,
    steps,
    active,
  })

  if (!result.success) {
    return { error: result.error || 'Không thể cập nhật micro-action' }
  }

  revalidatePath('/admin/actions')
  revalidatePath(`/admin/actions/${id}`)
  revalidatePath(`/admin/actions/${slug}`)
  revalidatePath('/recommendation')
  redirect('/admin/actions')
}

export async function deleteMicroAction(id: string) {
  await deleteOrToggleAdminAction(id, false)
  revalidatePath('/admin/actions')
  revalidatePath('/recommendation')
  redirect('/admin/actions')
}

export async function toggleMicroActionActive(id: string, currentActive: boolean) {
  await deleteOrToggleAdminAction(id, !currentActive)
  revalidatePath('/admin/actions')
  revalidatePath('/recommendation')
}

export async function handleSyncActions(): Promise<{
  success: boolean
  count: number
  error?: string
}> {
  const res = await syncActionsToSupabase()
  revalidatePath('/admin/actions')
  revalidatePath('/recommendation')
  return res
}
