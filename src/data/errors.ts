export class UnauthenticatedError extends Error {}

export class HttpError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const isHttpError = (err: unknown): err is HttpError => err instanceof HttpError;
