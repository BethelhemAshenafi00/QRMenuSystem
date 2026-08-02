interface Props { label: string; color?: 'green' | 'red' | 'yellow' | 'blue' | 'gray' | 'orange' | 'amber'; }

const colors = {
  green:  'bg-green-100 text-green-700',
  red:    'bg-red-100 text-red-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  blue:   'bg-blue-100 text-blue-700',
  gray:   'bg-gray-100 text-gray-700',
  orange: 'bg-orange-100 text-orange-700',
  amber:  'bg-amber-100 text-amber-700',
};

export default function Badge({ label, color = 'gray' }: Props) {
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>{label}</span>;
}