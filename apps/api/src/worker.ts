import * as Sentry from "@sentry/cloudflare";

import { setLogger } from "@app/shared/logger";

import { apiApp } from "./app";
import { SentryLogger } from "./lib/sentry-logger";

const sentryLogger = new SentryLogger();

export default Sentry.withSentry<CloudflareBindings>(
  () => {
    if (process.env.SENTRY_DSN) setLogger(sentryLogger);
    return { dsn: process.env.SENTRY_DSN, tracesSampleRate: 1.0 };
  },
  { fetch: apiApp.fetch },
);
