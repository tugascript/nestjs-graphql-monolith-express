import { Request, Response } from 'express';
import { ILoaders } from '../../loaders/interfaces/loaders.interface';
import { IExtra } from './extra.interface';

export interface ICtx {
  req: Request;
  res: Response;
  loaders: ILoaders;
  extra?: IExtra;
}
