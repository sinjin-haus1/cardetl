import { Module } from '@nestjs/common';
import { SocialService } from './social.service';
import { SocialResolver } from './social.resolver';
import { SocialController } from './social.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialAccount, SocialAccountSchema } from './schemas/social.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SocialAccount.name, schema: SocialAccountSchema }]),
  ],
  controllers: [SocialController],
  providers: [SocialService, SocialResolver],
  exports: [SocialService],
})
export class SocialModule {}
