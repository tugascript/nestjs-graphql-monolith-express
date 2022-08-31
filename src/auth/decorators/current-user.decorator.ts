import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ICtx } from '../../config/interfaces/ctx.interface';

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext): number | undefined => {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest()?.user;
    }

    const gqlCtx: ICtx = GqlExecutionContext.create(context).getContext();
    return (gqlCtx.req as any)?.user ?? gqlCtx?.extra.user.userId;
  },
);
