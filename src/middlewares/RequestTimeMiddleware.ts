import { NextFunction, Request, Response } from 'express';

export function requestTimeMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = new Date().getTime();

  res.on('finish', () => {
    const endTime = new Date().getTime();
    const duration = endTime - startTime;

    console.log(`X-Processing-Time: ${duration}ms`);
  });

  next();
}