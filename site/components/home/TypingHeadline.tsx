import type { CSSProperties, ElementType } from 'react'

export function TypingHeadline({
  text,
  style,
  as = 'h2'
}: {
  text: string
  style?: CSSProperties
  as?: ElementType
  caretColor?: string
}) {
  const Tag = as
  return <Tag style={style}>{text}</Tag>
}
