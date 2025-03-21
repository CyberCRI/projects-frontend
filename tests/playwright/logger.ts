export enum LogLevel {
  Debug,
  Info,
  Warning,
  Error,
}

export class Logger {
  private logLevel: LogLevel

  constructor(logLevel: LogLevel = LogLevel.Info) {
    this.logLevel = logLevel
  }

  private log(level: LogLevel, message: string): void {
    if (level >= this.logLevel) {
      const timestamp = new Date().toISOString()
      console.log(`[${timestamp}] [${LogLevel[level].toUpperCase()}] ${message}`)
    }
  }

  debug(message: string): void {
    this.log(LogLevel.Debug, message)
  }

  info(message: string): void {
    this.log(LogLevel.Info, message)
  }

  warning(message: string): void {
    this.log(LogLevel.Warning, message)
  }

  error(message: string): void {
    this.log(LogLevel.Error, message)
  }
}
