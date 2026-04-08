import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SocialService } from './social.service';
import { CreateSocialDto } from './dto/create-social.dto';

@Controller()
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @MessagePattern('social.findAll')
  async findAll() {
    return this.socialService.findAll();
  }

  @MessagePattern('social.connect')
  async connect(@Payload() createSocialDto: CreateSocialDto) {
    return this.socialService.create(createSocialDto);
  }
}
