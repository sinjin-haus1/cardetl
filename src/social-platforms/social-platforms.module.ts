import { Module } from '@nestjs/common';
import { TikTokService } from './tiktok.service';
import { InstagramService } from './instagram.service';
import { YouTubeService } from './youtube.service';

@Module({
  providers: [TikTokService, InstagramService, YouTubeService],
  exports: [TikTokService, InstagramService, YouTubeService],
})
export class SocialPlatformsModule {}
