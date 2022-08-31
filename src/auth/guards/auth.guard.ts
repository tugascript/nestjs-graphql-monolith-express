import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { ICtx } from '../../config/interfaces/ctx.interface';
import { AuthService } from '../auth.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (context.getType() === 'http') {
      return await this.setHttpHeader(
        context.switchToHttp().getRequest(),
        isPublic,
      );
    }

    const ctx: ICtx = GqlExecutionContext.create(context).getContext();

    if (ctx.extra) {
      return await this.authService.refreshUserSession(ctx.extra.user);
    }

    return await this.setHttpHeader(ctx.req, isPublic);
  }

  private async setHttpHeader(
    req: Request,
    isPublic: boolean,
  ): Promise<boolean> {
    const auth = req.headers?.authorization;

    if (!auth) return isPublic;

    const arr = auth.split(' ');

    if (arr[0] !== 'Bearer') return isPublic;

    try {
      const { id } = await this.authService.verifyAuthToken(arr[1], 'access');
      (req as any).user = id;
      return true;
    } catch (_) {
      return isPublic;
    }
  }
}
