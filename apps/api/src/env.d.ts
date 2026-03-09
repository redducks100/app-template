/// <reference types="@cloudflare/workers-types" />

interface CloudflareBindings {
  R2: R2Bucket;
}

declare namespace NodeJS {
  interface ProcessEnv {
    APP_URL: string;
    BETTER_AUTH_URL: string;
    COOKIE_DOMAIN: string;
    ASSETS_URL: string;

    DATABASE_URL: string;
    BETTER_AUTH_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    RESEND_API_KEY: string;
    SENTRY_DSN?: string;
  }
}
