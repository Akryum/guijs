export interface MetaSetting {
  id: string
  label: string
  description?: string
  categoryId: 'general' | 'display'
  defaultValue: any
}
