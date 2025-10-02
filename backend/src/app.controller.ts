// backend/src/app.controller.ts (MODIFIKASI UNTUK TES)
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string { return this.appService.getHello(); }
}