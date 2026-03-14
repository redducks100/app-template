export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  [key: string]: unknown;
}

export interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(error: Error | string, context?: LogContext): void;
  setUser(user: { id: string; email?: string }): void;
  setContext(key: string, data: Record<string, unknown>): void;
}

export class ConsoleLogger implements Logger {
  private user: { id: string; email?: string } | null = null;
  private contexts: Record<string, Record<string, unknown>> = {};

  debug(message: string, context?: LogContext): void {
    // oxlint-disable-next-line no-console
    console.debug(message, this.buildMeta(context));
  }

  info(message: string, context?: LogContext): void {
    // oxlint-disable-next-line no-console
    console.info(message, this.buildMeta(context));
  }

  warn(message: string, context?: LogContext): void {
    // oxlint-disable-next-line no-console
    console.warn(message, this.buildMeta(context));
  }

  error(error: Error | string, context?: LogContext): void {
    // oxlint-disable-next-line no-console
    console.error(error, this.buildMeta(context));
  }

  setUser(user: { id: string; email?: string }): void {
    this.user = user;
  }

  setContext(key: string, data: Record<string, unknown>): void {
    this.contexts[key] = data;
  }

  private buildMeta(context?: LogContext): Record<string, unknown> {
    const meta: Record<string, unknown> = {};
    if (this.user) meta.user = this.user;
    if (Object.keys(this.contexts).length > 0) meta.contexts = this.contexts;
    if (context) meta.context = context;
    return meta;
  }
}

let _logger: Logger = new ConsoleLogger();

export function getLogger(): Logger {
  return _logger;
}

export function setLogger(logger: Logger): void {
  _logger = logger;
}
