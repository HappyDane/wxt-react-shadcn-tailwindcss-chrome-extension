/**
 * Thin logging wrapper so we don't sprinkle `console.*` calls across the
 * codebase. Stripped to a no-op in production builds (set via Vite's
 * `import.meta.env.PROD`). Add log shipping / Sentry / etc. in one place.
 */
const isProd = import.meta.env.PROD;

function ts(): string {
  return new Date().toISOString().slice(11, 23);
}

export const log = {
  debug(...args: unknown[]): void {
    if (isProd) return;
    // eslint-disable-next-line no-console
    console.debug(`[${ts()}]`, ...args);
  },
  info(...args: unknown[]): void {
    if (isProd) return;
    // eslint-disable-next-line no-console
    console.info(`[${ts()}]`, ...args);
  },
  warn(...args: unknown[]): void {
    // eslint-disable-next-line no-console
    console.warn(`[${ts()}]`, ...args);
  },
  error(...args: unknown[]): void {
    // eslint-disable-next-line no-console
    console.error(`[${ts()}]`, ...args);
  },
};
