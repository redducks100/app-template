import * as Sentry from "@sentry/cloudflare";
import { setLogger } from "@app/shared/logger";
import { SentryLogger } from "./lib/sentry-logger.js";
import { apiApp } from "./app.js";

const sentryLogger = new SentryLogger();

export default Sentry.withSentry(
  (env) => {
    if (env.SENTRY_DSN) setLogger(sentryLogger);
    return { dsn: env.SENTRY_DSN, tracesSampleRate: 1.0 };
  },
  { fetch: apiApp.fetch },
);
