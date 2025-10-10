import { Response } from 'express';

interface ApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data?: T | null;
}

export const generateResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T | null
) => {
  const success = statusCode >= 200 && statusCode < 300;

  const response: ApiResponse<T> = {
    status: success,
    statusCode,
    message,
    data: data ?? null,
  };

  return res.status(statusCode).json(response);
};
