import * as Sentry from "@sentry/nextjs";

/**
 * Captures an exception manually and sends it to Sentry.
 * @param error The error to capture
 * @param context Optional context information
 */
export function captureError(error: any, context?: Record<string, any>) {
  console.error("Manual Sentry Capture:", error, context);
  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Sends a manual message to Sentry.
 * @param message The message to send
 * @param level The severity level
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = "info") {
  Sentry.captureMessage(message, level);
}
