import type { CreateClientParams } from '../contentful'
import type { TimelinePreview } from '../types/timeline-preview'
import { checkEnableTimelinePreviewIsAllowed } from './validate-params'
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

export const getTimelinePreviewParams = (params: CreateClientParams) => {
  const host = params?.host as string
  const timelinePreview =
    params?.timelinePreview ?? (params?.alphaFeatures?.timelinePreview as TimelinePreview)
  const enabled = checkEnableTimelinePreviewIsAllowed(host, timelinePreview)
  return { enabled, timelinePreview }
}
