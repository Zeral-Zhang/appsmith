export type ENVIRONMENT = "PRODUCTION" | "STAGING" | "LOCAL"
export const SENTRY_PROD_CONFIG = { dsn: "https://a63362b692d64edeb175741f1f80b091@sentry.io/1546547", environment: 'Production' }
export const SENTRY_STAGE_CONFIG = { dsn: "https://a63362b692d64edeb175741f1f80b091@sentry.io/1546547", environment: 'Staging' }
export const SENTRY_CONFIG = process.env.REACT_APP_ENVIRONMENT === "PRODUCTION" ? SENTRY_PROD_CONFIG : process.env.REACT_APP_ENVIRONMENT === "STAGING" ? SENTRY_STAGE_CONFIG : {}