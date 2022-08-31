import { Request, Response } from 'express';

export interface IContextFunction {
  req: Request;
  res: Response;
}
