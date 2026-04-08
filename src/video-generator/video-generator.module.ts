import { Module } from '@nestjs/common';
import { VideoGeneratorService } from './video-generator.service';
import { HookGenerationService } from './hook-generation.service';
import { TtsService } from './tts.service';
import { CloudinaryService } from './cloudinary.service';

@Module({
  providers: [VideoGeneratorService, HookGenerationService, TtsService, CloudinaryService],
  exports: [VideoGeneratorService, HookGenerationService, TtsService, CloudinaryService],
})
export class VideoGeneratorModule {}
