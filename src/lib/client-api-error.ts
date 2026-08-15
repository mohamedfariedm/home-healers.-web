export class ClientApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;
  body?: unknown;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>,
    body?: unknown,
  ) {
    super(message);
    this.name = "ClientApiError";
    this.status = status;
    this.errors = errors;
    this.body = body;
  }

  isPackageOutOfStock() {
    return (
      this.status === 422 &&
      Array.isArray(this.errors?.package_id) &&
      this.errors.package_id.length > 0
    );
  }
}

export function isClientApiError(error: unknown): error is ClientApiError {
  return error instanceof ClientApiError;
}
