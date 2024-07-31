class ApiError extends Error {
  message: string;
  statusCode: number;
  errors: [];
  constructor(
    statusCode: number,
    message = "Something went wrong",
    errors: [] = []
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export { ApiError };
