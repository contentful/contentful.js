export class ValidationError extends Error {
  constructor(name: string, message: string) {
    super(`Invalid "${name}" provided, ` + message)
    this.name = 'ValidationError'
  }
}
