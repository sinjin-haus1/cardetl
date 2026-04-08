import { Controller, OnModuleInit } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TemplatesService } from './templates.service';

@Controller()
export class TemplatesController implements OnModuleInit {
  constructor(private readonly templatesService: TemplatesService) {}

  async onModuleInit() {
    await this.templatesService.seedPresets();
  }

  @MessagePattern('templates.findAll')
  async findAll() {
    return this.templatesService.findAll();
  }
}
