import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { GraphQLClient } from 'graphql-request';
import { Client, createClient } from 'graphql-ws';
import request from 'supertest';
import WebSocket from 'ws';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let wsClient: Client;
  let httpClient: GraphQLClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const configService = app.get(ConfigService);
    const port = configService.get<number>('port');
    await app.listen(port);

    wsClient = createClient({
      url: `ws://localhost:${port}/api/graphql`,
      webSocketImpl: WebSocket,
    });
    httpClient = new GraphQLClient(`http://localhost:${port}/api/graphql`);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
