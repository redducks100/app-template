declare namespace NodeJS {
  interface ProcessEnv {
    // Public vars (wrangler.jsonc)
    APP_URL: string;
    BETTER_AUTH_URL: string;
    COOKIE_DOMAIN: string;
    // Secrets (wrangler secrets / .dev.vars)
    DATABASE_URL: string;
    BETTER_AUTH_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    RESEND_API_KEY: string;
  }
}
