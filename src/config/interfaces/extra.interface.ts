import { Request } from 'express';
import { SubscribePayload, WebSocket } from 'graphql-ws';
import { ILoaders } from '../../loaders/interfaces/loaders.interface';
import { IExtraUser } from './extra-user.interface';

export interface IExtra {
  user: IExtraUser;
  payload: SubscribePayload;
  socket: WebSocket;
  request: Request;
  loaders: ILoaders;
}
