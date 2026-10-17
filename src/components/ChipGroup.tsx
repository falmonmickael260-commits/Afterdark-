interface Option<T extends string> {
  value: T
  label: string
}

interface Props<T extends string> {
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
}

export function ChipGroup<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all border ${
              active
                ? 'bg-gradient-to-r from-[#ff2e63] to-[#9b5de5] text-white border-transparent shadow-[0_4px_20px_rgba(255,46,99,0.35)]'
                : 'bg-white/5 text-[var(--text-dim)] border-white/10 hover:border-white/25'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
