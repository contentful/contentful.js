/*
* sdk relies heavily on sys metadata
* so we cannot omit the sys property on sdk level
* */

export default function normalizeSelect (query) {
  if (query.select && !/sys/i.test(query.select)) {
    query.select += ',sys'
  }
}
