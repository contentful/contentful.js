import type { TimelinePreview } from '../types/timeline-preview'
import { ValidationError } from './validation-error'

function isValidRelease(release: TimelinePreview['release']): boolean {
  return !!(release && typeof release === 'object' && typeof release.lte === 'string')
}

function isValidTimestamp(timestamp: TimelinePreview['timestamp']): boolean {
  return !!(
    timestamp &&
    typeof timestamp === 'object' &&
    (typeof timestamp.lte === 'string' || timestamp.lte instanceof Date)
  )
}

const isValidTimelinePreviewConfig = (timelinePreview: TimelinePreview) => {
  const hasRelease = isValidRelease(timelinePreview.release)
  const hasTimestamp = isValidTimestamp(timelinePreview.timestamp)

  if (!hasRelease && !hasTimestamp) {
    throw new ValidationError(
      'query',
      `The 'query' object must have at least one of 'release' or 'timestamp' with a valid 'lte' property for Timeline Preview.`,
    )
  }

  return hasRelease || hasTimestamp
}

export function checkEnableTimelinePreviewIsAllowed(
  host: string,
  timelinePreview: TimelinePreview,
) {
  if (!timelinePreview) {
    return false
  }

  const isValidConfig = isValidTimelinePreviewConfig(timelinePreview)

  const isValidHost = typeof host === 'string' && host.startsWith('preview')

  if (isValidConfig && !isValidHost) {
    throw new ValidationError(
      'timelinePreview',
      `The 'timelinePreview' parameter can only be used with the CPA. Please set host to 'preview.contentful.com' to enable Timeline Preview.
      `,
    )
  }

  return true
}
