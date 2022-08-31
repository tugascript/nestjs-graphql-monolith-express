import { ICtx } from '../../config/interfaces/ctx.interface';

export const contextToUser = (ctx: ICtx): number => {
  return ctx?.extra.user.userId ?? (ctx.req as any).user;
};
