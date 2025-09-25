import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(date) {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatNumber(num, decimals = 2) {
  return Number(num).toFixed(decimals)
}

export function getAccuracyColor(accuracy) {
  if (accuracy >= 90) return 'text-green-500'
  if (accuracy >= 80) return 'text-blue-500'
  if (accuracy >= 70) return 'text-yellow-500'
  return 'text-red-500'
}

export function getLossColor(loss) {
  if (loss <= 0.1) return 'text-green-500'
  if (loss <= 0.5) return 'text-blue-500'
  if (loss <= 1.0) return 'text-yellow-500'
  return 'text-red-500'
}