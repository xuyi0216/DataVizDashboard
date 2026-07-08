export function formatNumber(value: number): string {
  return value.toLocaleString('zh-CN')
}

export function formatCurrency(value: number): string {
  return `¥${formatNumber(value)}`
}

export function formatDate(value: string | number | Date): string {
  const d = new Date(value)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
