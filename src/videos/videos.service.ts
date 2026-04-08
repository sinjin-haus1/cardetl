import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video, VideoDocument } from './schemas/video.schema';
import { CreateVideoDto } from './dto/create-video.dto';

@Injectable()
export class VideosService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
  ) {}

  async findAll(): Promise<Video[]> {
    return this.videoModel.find().exec();
  }

  async findByTransformation(transformationId: string): Promise<Video[]> {
    return this.videoModel.find({ transformationId }).exec();
  }

  async findOne(id: string): Promise<Video> {
    return this.videoModel.findById(id).exec();
  }

  async create(createVideoDto: CreateVideoDto): Promise<Video> {
    const createdVideo = new this.videoModel(createVideoDto);
    return createdVideo.save();
  }
}
