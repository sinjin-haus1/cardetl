import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transformation, TransformationDocument } from './schemas/transformation.schema';
import { CreateTransformationDto } from './dto/create-transformation.dto';

@Injectable()
export class TransformationsService {
  constructor(
    @InjectModel(Transformation.name) private transformationModel: Model<TransformationDocument>,
  ) {}

  async findAll(): Promise<Transformation[]> {
    return this.transformationModel.find().exec();
  }

  async findByVehicle(vehicleId: string): Promise<Transformation[]> {
    return this.transformationModel.find({ vehicleId }).exec();
  }

  async findOne(id: string): Promise<Transformation> {
    return this.transformationModel.findById(id).exec();
  }

  async create(createTransformationDto: CreateTransformationDto): Promise<Transformation> {
    const createdTransformation = new this.transformationModel(createTransformationDto);
    return createdTransformation.save();
  }

  async updateStatus(id: string, status: string): Promise<Transformation> {
    return this.transformationModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
  }
}
