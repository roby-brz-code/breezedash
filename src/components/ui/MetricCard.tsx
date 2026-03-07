import Card from './Card'
import StatusChip from './StatusChip'

interface MetricCardProps {
  label: string
  value: string
  delta?: number
  accent?: 'emerald' | 'amber' | 'red' | 'blue' | 'gray'
}

export default function MetricCard({ label, value, delta, accent }: MetricCardProps) {
  return (
    <Card accent={accent} className="px-5 py-4">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {delta !== undefined && <StatusChip value={delta} />}
      </div>
    </Card>
  )
}
