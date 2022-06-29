class AppError extends Error {
  constructor(message, statusCode) {
    super(message),
      (this.statusCode = statusCode),
      (this.message = message),
      (this.operational = true),
      Error.captureStackTrace(this, this.construtor);
  }
}

module.exports = AppError;
