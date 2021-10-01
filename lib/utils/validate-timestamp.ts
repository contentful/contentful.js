export class ValidationError extends Error {
  constructor(name: string, message: string) {
    super(`Invalid "${name}" provided, ` + message)
    this.name = 'ValidationError'
  }
}

type Options = {
  maximum?: number
  now?: number
}

export default function validateTimestamp(
  name: string,
  timestamp: number,
  options?: Options
): void {
  options = options || {}

  if (typeof timestamp !== 'number') {
    throw new ValidationError(
      name,
      `only numeric values are allowed for timestamps, provided type was "${typeof timestamp}"`
    )
  }
  if (options.maximum && timestamp > options.maximum) {
    throw new ValidationError(
      name,
      `value (${timestamp}) cannot be further in the future than expected maximum (${options.maximum})`
    )
  }
  if (options.now && timestamp < options.now) {
    throw new ValidationError(
      name,
      `value (${timestamp}) cannot be in the past, current time was ${options.now}`
    )
  }
}
