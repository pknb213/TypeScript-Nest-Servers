import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {EventsGateway} from "./ws/events/events.gateway";

import WebSocket from 'ws';

@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,
      private readonly eventsGateway: EventsGateway
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Get(`events`)
  // getEvents() {
  //   return this.eventsGateway.onEvent("Client", "Data")
  // }
}
