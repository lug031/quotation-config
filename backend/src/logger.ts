type LogLevel = "info" | "warn" | "error";

function formatTimestamp(): string {
  return new Date().toISOString();
}

function log(level: LogLevel, message: string, data?: Record<string, unknown>): void {
  const timestamp = formatTimestamp();
  const payload = data ? ` ${JSON.stringify(data)}` : "";
  const line = `[${timestamp}] [${level.toUpperCase()}] ${message}${payload}`;
  if (level === "error") {
    // eslint-disable-next-line no-console
    console.error(line);
  } else if (level === "warn") {
    // eslint-disable-next-line no-console
    console.warn(line);
  } else {
    // eslint-disable-next-line no-console
    console.log(line);
  }
}

export const logger = {
  info(message: string, data?: Record<string, unknown>): void {
    log("info", message, data);
  },
  warn(message: string, data?: Record<string, unknown>): void {
    log("warn", message, data);
  },
  error(message: string, data?: Record<string, unknown>): void {
    log("error", message, data);
  },
};
