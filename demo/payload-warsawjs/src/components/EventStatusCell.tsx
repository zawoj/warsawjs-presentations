'use client'

import type { DefaultCellComponentProps } from 'payload'

export const EventStatusCell = ({ cellData }: DefaultCellComponentProps) => {
  const published = cellData === 'published'

  return (
    <span
      style={{
        alignItems: 'center',
        color: published ? '#147a49' : '#665a16',
        display: 'inline-flex',
        fontFamily: 'monospace',
        fontSize: 12,
        fontWeight: 600,
        gap: 7,
        letterSpacing: '.04em',
        textTransform: 'uppercase',
      }}
    >
      <i
        aria-hidden="true"
        style={{
          background: published ? '#20a464' : '#c7a928',
          borderRadius: 999,
          display: 'block',
          height: 7,
          width: 7,
        }}
      />
      {published ? 'Published' : 'Draft'}
    </span>
  )
}
