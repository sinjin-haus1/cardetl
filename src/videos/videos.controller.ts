import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';

@Controller()
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @MessagePattern('videos.findAll')
  async findAll() {
    return this.videosService.findAll();
  }

  @MessagePattern('videos.create')
  async create(@Payload() createVideoDto: CreateVideoDto) {
    return this.videosService.create(createVideoDto);
  }
}
