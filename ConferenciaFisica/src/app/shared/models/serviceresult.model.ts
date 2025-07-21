export interface ServiceResult<T> {
    status: boolean;
    mensagens: string[];
    error?: string | null;
    result: T | null;
  }
  