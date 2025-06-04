export type TimelinePreview = {
  release?: { lte: string }
  timestamp?: { lte: string | Date }
} & ({ release: { lte: string } } | { timestamp: { lte: string | Date } })
