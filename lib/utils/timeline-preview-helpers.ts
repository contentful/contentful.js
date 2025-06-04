import type { TimelinePreview } from '../types/timeline-preview'
import { ValidationError } from './validation-error'

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

  const hasRelease =
    timelinePreview.release &&
    typeof timelinePreview.release === 'object' &&
    typeof timelinePreview.release.lte === 'string'

  const hasTimestamp =
    timelinePreview.timestamp &&
    typeof timelinePreview.timestamp === 'object' &&
    (typeof timelinePreview.timestamp.lte === 'string' ||
      timelinePreview.timestamp.lte instanceof Date)

  if (!hasRelease && !hasTimestamp) {
    throw new ValidationError(
      'timelinePreview',
      `The 'timelinePreview' object must have at least one of 'release' or 'timestamp' with a valid 'lte' property.`,
    )
  }

  return hasRelease || hasTimestamp
}
