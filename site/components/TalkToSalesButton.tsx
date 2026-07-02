'use client'

import { Button, extractText } from '@/components/ui'
import { openCalendly } from '@/lib/openCalendly'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'invert' | 'ghost'
type Size = 'md' | 'lg' | 'sm'

export function TalkToSalesButton({
  children,
  location = 'talk_to_sales',
  plan,
  variant = 'secondary',
  size = 'md',
  className
}: {
  children: ReactNode
  location?: string
  plan?: string
  variant?: Variant
  size?: Size
  className?: string
}) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      // No trackLocation here — openCalendly() pushes the book_demo event
      // (with button_id + button_event). A trackLocation would make Button
      // fire a second cta_click push and double-count this physical button.
      onClick={(e) => {
        e.preventDefault()
        openCalendly(location, plan, extractText(children).trim() || 'Talk to Sales')
      }}
    >
      {children}
    </Button>
  )
}
