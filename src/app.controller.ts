import { Controller, Get, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

// Because of nginx
@Controller()
export class AppController {
  private readonly port = this.configService.get<number>('port');

  constructor(private readonly configService: ConfigService) {}

  @Get()
  public getInitialRoute() {
    return `Server running on ${this.port}`;
  }

  @Get('/favicon.ico')
  public getFavicon(@Res() res: Response) {
    res.sendFile('/favicon.ico');
  }
}
