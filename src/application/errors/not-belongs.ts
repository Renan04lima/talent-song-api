export class NotBelogsError extends Error {
  constructor () {
    super('This resource does not belong to you')
    this.name = 'NotBelogsError'
  }
}
