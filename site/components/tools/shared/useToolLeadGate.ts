'use client'

// Gate a tool action behind the shared lead modal. The user picked
// "gate every time", so there's no persistence — every gated action opens the
// form, and the action runs only after a successful submit.
//
// Usage:
//   const gate = useToolLeadGate()
//   // CTA handler (after input validation):
//   gate.request(() => runTheScan())
//   // render:
//   <ToolLeadModal open={gate.open} tool="robots-checker"
//     onClose={gate.close} onSuccess={gate.success} />

import { useCallback, useRef, useState } from 'react'

export function useToolLeadGate() {
  const [open, setOpen] = useState(false)
  const actionRef = useRef<(() => void) | null>(null)

  const request = useCallback((action: () => void) => {
    actionRef.current = action
    setOpen(true)
  }, [])

  const success = useCallback(() => {
    setOpen(false)
    const action = actionRef.current
    actionRef.current = null
    action?.()
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    actionRef.current = null
  }, [])

  return { open, request, success, close }
}
