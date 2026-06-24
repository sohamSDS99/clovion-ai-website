'use client'

import { useId, useState } from 'react'

type FaqItem = { question: string; answer: string }

function ToggleIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      aria-hidden
      className="shrink-0 text-[var(--ink-50)] transition-transform duration-300"
      style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
    >
      <path
        d="M8 3v10M3 8h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0)
  const baseId = useId()

  return (
    <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
      {items.map((item, i) => {
        const isOpen = open === i
        const btnId = `${baseId}-q-${i}`
        const panelId = `${baseId}-a-${i}`
        return (
          <div key={i}>
            <h3 className="m-0">
              <button
                type="button"
                id={btnId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg leading-snug text-[var(--ink)] hover:text-[var(--ink-70)]"
              >
                <span>{item.question}</span>
                <ToggleIcon open={isOpen} />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className="pb-6"
            >
              <div className="max-w-2xl text-base leading-relaxed text-[var(--ink-70)] [&_a]:underline [&_a:hover]:text-[var(--ink)]">
                {item.answer
                  .split(/\n{2,}/)
                  .filter(Boolean)
                  .map((para, p) => (
                    <p key={p} className={p === 0 ? '' : 'mt-4'}>
                      {para}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
