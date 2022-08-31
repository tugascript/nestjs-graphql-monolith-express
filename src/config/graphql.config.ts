import { KeyvAdapter } from '@apollo/utils.keyvadapter';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlOptionsFactory } from '@nestjs/graphql';
import apolloResponseCache from 'apollo-server-plugin-response-cache';
import { Context } from 'graphql-ws';
import Keyv from 'keyv';
import { AuthService } from '../auth/auth.service';
import { LoadersService } from '../loaders/loaders.service';
import { IContextFunction } from './interfaces/context-function.interface';
import { ICtx } from './interfaces/ctx.interface';
import { IExtra } from './interfaces/extra.interface';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  private readonly testing = this.configService.get<boolean>('testing');

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly loadersService: LoadersService,
  ) {}

  public createGqlOptions(): ApolloDriverConfig {
    return {
      driver: ApolloDriver,
      context: ({ req, res }: IContextFunction): ICtx => ({
        req,
        res,
        loaders: this.loadersService.getLoaders(),
      }),
      path: '/api/graphql',
      autoSchemaFile: './schema.gql',
      debug: this.testing,
      sortSchema: true,
      bodyParserConfig: false,
      playground: this.testing,
      plugins: [apolloResponseCache()],
      cors: {
        origin: this.configService.get<string>('url'),
        credentials: true,
      },
      cache: this.testing
        ? undefined
        : new KeyvAdapter(
            new Keyv(this.configService.get<string>('redisUrl'), {
              ttl: this.configService.get<number>('ttl'),
            }),
          ),
      subscriptions: {
        'graphql-ws': {
          onConnect: async (
            ctx: Context<{ authorization?: string }, IExtra>,
          ) => {
            const authHeader = ctx?.connectionParams?.authorization;

            if (!authHeader) return false;

            const authArr = authHeader.split(' ');

            if (authArr.length !== 2 || authArr[0] !== 'Bearer') return false;

            const result = await this.authService.generateWsSession(authArr[1]);

            if (!result) return false;

            const [userId, sessionId] = result;

            ctx.extra.user = {
              userId,
              sessionId,
            };
            return true;
          },
          onSubscribe: async (
            ctx: Context<{ authorization?: string }, IExtra>,
            message,
          ) => {
            ctx.extra.payload = message.payload;
            ctx.extra.loaders = this.loadersService.getLoaders();
          },
          onClose: async (ctx: Context<{ authorization?: string }, IExtra>) => {
            if (ctx.extra?.user)
              await this.authService.closeUserSession(ctx.extra.user);
          },
        },
      },
    };
  }
}
