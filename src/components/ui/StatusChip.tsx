interface StatusChipProps {
  value: number
  suffix?: string
}

export default function StatusChip({ value, suffix = '%' }: StatusChipProps) {
  const isPositive = value >= 0
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${
        isPositive
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-red-50 text-red-700'
      }`}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={isPositive ? '' : 'rotate-180'}
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
      {Math.abs(value).toFixed(1)}{suffix}
    </span>
  )
}
