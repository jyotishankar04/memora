export interface ApiSuccessBody<T> {
  success: true;
  data: T;
  meta: Record<string, unknown>;
  error: null;
}

export interface ApiErrorBody {
  success: false;
  data: null;
  meta: Record<string, unknown>;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export const ApiResponse = {
  success<T>(data: T, meta: Record<string, unknown> = {}): ApiSuccessBody<T> {
    return { success: true, data, meta, error: null };
  },

  error(code: string, message: string, details?: unknown): ApiErrorBody {
    return {
      success: false,
      data: null,
      meta: {},
      error: { code, message, details },
    };
  },
};
