import type { TimelinePreview } from '../types/timeline-preview'
import { ValidationError } from './validation-error'

function isValidRelease(release: any): boolean {
  return release && typeof release === 'object' && typeof release.lte === 'string'
}

function isValidTimestamp(timestamp: any): boolean {
  return (
    timestamp &&
    typeof timestamp === 'object' &&
    (typeof timestamp.lte === 'string' || timestamp.lte instanceof Date)
  )
}

export const isValidTimelinePreviewConfig = (timelinePreview: TimelinePreview) => {
  if (
    typeof timelinePreview !== 'object' ||
    timelinePreview === null ||
    Array.isArray(timelinePreview)
  ) {
    throw new ValidationError(
      'timelinePreview',
      `The 'timelinePreview' parameter must be an object.`,
    )
  }

  const hasRelease = isValidRelease(timelinePreview.release)
  const hasTimestamp = isValidTimestamp(timelinePreview.timestamp)

  if (!hasRelease && !hasTimestamp) {
    throw new ValidationError(
      'timelinePreview',
      `The 'timelinePreview' object must have at least one of 'release' or 'timestamp' with a valid 'lte' property.`,
    )
  }

  return hasRelease || hasTimestamp
}
