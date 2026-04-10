/**
 * Production-grade Logger
 * 
 * - Only logs in development by default
 * - Structured logging format
 * - Can be extended to send to external services (Sentry, LogRocket, etc.)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
}

const isDev = process.env.NODE_ENV === 'development';
const isClient = typeof window !== 'undefined';

// Color codes for console
const colors = {
  debug: '#9CA3AF',
  info: '#3B82F6',
  warn: '#F59E0B',
  error: '#EF4444',
};

function formatLog(entry: LogEntry): string {
  const { level, message, timestamp, context } = entry;
  const contextStr = context ? ` ${JSON.stringify(context)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
}

function createLogEntry(level: LogLevel, message: string, context?: LogContext): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  };
}

function logToConsole(entry: LogEntry): void {
  if (!isDev) return;

  const formatted = formatLog(entry);
  const color = colors[entry.level];

  if (isClient) {
    console[entry.level === 'debug' ? 'log' : entry.level](
      `%c${formatted}`,
      `color: ${color}`
    );
  } else {
    console[entry.level === 'debug' ? 'log' : entry.level](formatted);
  }
}

// External logging hook (for Sentry, etc.)
type ExternalLogger = (entry: LogEntry) => void;
let externalLogger: ExternalLogger | null = null;

export function setExternalLogger(logger: ExternalLogger): void {
  externalLogger = logger;
}

function log(level: LogLevel, message: string, context?: LogContext): void {
  const entry = createLogEntry(level, message, context);
  
  logToConsole(entry);
  
  // Send errors to external service in production
  if (level === 'error' && externalLogger) {
    externalLogger(entry);
  }
}

export const logger = {
  debug: (message: string, context?: LogContext) => log('debug', message, context),
  info: (message: string, context?: LogContext) => log('info', message, context),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  error: (message: string, context?: LogContext) => log('error', message, context),
  
  // Convenience method for logging errors with stack trace
  exception: (error: unknown, context?: LogContext) => {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    log('error', errorObj.message, {
      ...context,
      stack: errorObj.stack,
      name: errorObj.name,
    });
  },
  
  // Group related logs
  group: (label: string, fn: () => void) => {
    if (isDev && isClient) {
      console.group(label);
      fn();
      console.groupEnd();
    } else {
      fn();
    }
  },
  
  // Time operations
  time: (label: string) => {
    if (isDev) console.time(label);
  },
  
  timeEnd: (label: string) => {
    if (isDev) console.timeEnd(label);
  },
};

export default logger;
