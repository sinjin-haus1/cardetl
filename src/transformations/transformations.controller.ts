import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransformationsService } from './transformations.service';
import { CreateTransformationDto } from './dto/create-transformation.dto';

@Controller()
export class TransformationsController {
  constructor(private readonly transformationsService: TransformationsService) {}

  @MessagePattern('transformations.findAll')
  async findAll() {
    return this.transformationsService.findAll();
  }

  @MessagePattern('transformations.create')
  async create(@Payload() createTransformationDto: CreateTransformationDto) {
    return this.transformationsService.create(createTransformationDto);
  }
}
