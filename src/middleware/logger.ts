import { Request, Response, NextFunction } from 'express';

export const logger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.route)
  console.log(req.body)
  next();
};
