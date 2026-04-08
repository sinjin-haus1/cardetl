import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SocialAccount, SocialAccountDocument } from './schemas/social.schema';
import { CreateSocialDto } from './dto/create-social.dto';

@Injectable()
export class SocialService {
  constructor(
    @InjectModel(SocialAccount.name) private socialModel: Model<SocialAccountDocument>,
  ) {}

  async findAll(): Promise<SocialAccount[]> {
    return this.socialModel.find().exec();
  }

  async findByAccount(accountId: string): Promise<SocialAccount[]> {
    return this.socialModel.find({ accountId }).exec();
  }

  async findOne(id: string): Promise<SocialAccount> {
    return this.socialModel.findById(id).exec();
  }

  async create(createSocialDto: CreateSocialDto): Promise<SocialAccount> {
    const createdSocial = new this.socialModel(createSocialDto);
    return createdSocial.save();
  }

  async updateTokens(id: string, accessToken: string, refreshToken?: string): Promise<SocialAccount> {
    const update: any = { accessToken };
    if (refreshToken) update.refreshToken = refreshToken;
    return this.socialModel.findByIdAndUpdate(id, update, { new: true }).exec();
  }
}
