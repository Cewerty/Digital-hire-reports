/**
 * Уникальный идентификатор события ленты куратора.
 *
 * `crypto.randomUUID()` доступен только в secure context (HTTPS / localhost),
 * поэтому для http-окружений и старых браузеров есть fallback. `Date.now()`
 * в одиночку не годится: два события в одном тике получили бы одинаковый
 * `id`, и React потерял бы одно из них при рендере списка.
 */
export function createEventId(): string {
  const cryptoApi = globalThis.crypto;

  if (cryptoApi && typeof cryptoApi.randomUUID === "function") {
    return `evt-${cryptoApi.randomUUID()}`;
  }

  const random = Math.random().toString(36).slice(2, 10);
  return `evt-${Date.now().toString(36)}-${random}`;
}
