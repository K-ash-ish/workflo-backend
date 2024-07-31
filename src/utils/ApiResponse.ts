class ApiResponse<T> {
  statusCode: number;
  message: string;
  success: boolean;
  data?: T;
  constructor(statusCode: number, message = "Success", data?: T) {
    this.message = message;
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.data = data;
  }
}
export { ApiResponse };
