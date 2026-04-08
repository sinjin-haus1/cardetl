import { Module } from '@nestjs/common';
import { TransformationsService } from './transformations.service';
import { TransformationsResolver } from './transformations.resolver';
import { TransformationsController } from './transformations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transformation, TransformationSchema } from './schemas/transformation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transformation.name, schema: TransformationSchema }]),
  ],
  controllers: [TransformationsController],
  providers: [TransformationsService, TransformationsResolver],
  exports: [TransformationsService],
})
export class TransformationsModule {}
