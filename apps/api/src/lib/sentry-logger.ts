import * as Sentry from "@sentry/cloudflare";

import type { LogContext, Logger } from "@app/shared/logger";

export class SentryLogger implements Logger {
  debug(message: string, context?: LogContext): void {
    Sentry.addBreadcrumb({ level: "debug", message, data: context });
  }

  info(message: string, context?: LogContext): void {
    Sentry.addBreadcrumb({ level: "info", message, data: context });
  }

  warn(message: string, context?: LogContext): void {
    Sentry.captureMessage(message, { level: "warning", extra: context });
  }

  error(error: Error | string, context?: LogContext): void {
    if (error instanceof Error) {
      Sentry.captureException(error, { extra: context });
    } else {
      Sentry.captureMessage(error, { level: "error", extra: context });
    }
  }

  setUser(user: { id: string; email?: string }): void {
    Sentry.setUser(user);
  }

  setContext(key: string, data: Record<string, unknown>): void {
    Sentry.setContext(key, data);
  }
}
