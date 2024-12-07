import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack?.toString()); // loga o erro no console

  const statusCode = err.statusCode || 500; // define o status HTTP, padrão 500 (Erro interno)
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: true,
    message,
  });
};

export default errorHandler;
