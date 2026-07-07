import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface Option {
  value: string
  label: string
}

interface Props {
  value: string
  options: Option[]
  onChange: (value: string) => void
  placeholder?: string
  renderValue?: (label: string) => React.ReactNode
  renderOption?: (opt: Option, selected: boolean) => React.ReactNode
}

function Select({ value, options, onChange, placeholder, renderValue, renderOption }: Props) {
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({})
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function toggle() {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const menuHeight = 280
      if (spaceBelow < menuHeight) {
        setMenuStyle({
          top: rect.top - 6,
          left: rect.left,
          width: rect.width,
          transform: 'translateY(-100%)',
        })
      } else {
        setMenuStyle({
          top: rect.bottom + 6,
          left: rect.left,
          width: rect.width,
        })
      }
    }
    setOpen((v) => !v)
  }

  return (
    <div className="custom-select" ref={ref}>
      <button
        ref={triggerRef}
        className="custom-select__trigger"
        onClick={toggle}
      >
        <span className={value ? '' : 'custom-select__placeholder'}>
          {selected ? (renderValue?.(selected.label) ?? selected.label) : placeholder ?? 'Selecionar'}
        </span>
        <ChevronDown size={16} className={`custom-select__arrow ${open ? 'custom-select__arrow--up' : ''}`} />
      </button>
      {open && (
        <div className="custom-select__menu" style={menuStyle}>
          {options.map((opt) => (
            <button
              key={opt.value}
              className={`custom-select__option ${opt.value === value ? 'custom-select__option--selected' : ''}`}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
            >
              {renderOption ? renderOption(opt, opt.value === value) : opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Select