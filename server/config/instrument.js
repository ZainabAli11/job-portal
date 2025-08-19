import * as Sentry from "@sentry/node";

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN || "YOUR_SENTRY_DSN",
    // Remove tracing/profiler to avoid errors
  });

  return Sentry;
};
