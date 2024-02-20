import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors/BaseError';
export function errorHandlerMiddleware(err: CustomError, req: Request, res: Response, next: NextFunction): void {
    console.error(err); // Log the error for debugging purposes

    const statusCode = err.code || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({ error: message });
}
