import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fluentFfmpg from 'fluent-ffmpeg';
import * as ffmpegStatic from 'ffmpeg-static';
import * as path from 'path';
import * as fs from 'fs';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class VideoGeneratorService {
  constructor(
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    fluentFfmpg.setFfmpegPath(ffmpegStatic as string);
  }

  async renderTransformation(
    beforeImageUrl: string,
    afterImageUrl: string,
    templateSlug: string,
    voiceoverUrl?: string,
  ): Promise<string> {
    const outputPath = path.join(__dirname, '../../../uploads', `${Date.now()}-output.mp4`);
    
    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }

    return new Promise((resolve, reject) => {
      fluentFfmpg()
        .input(beforeImageUrl)
        .input(afterImageUrl)
        .inputsFormat('image2')
        .complexFilter([
          '[0:v]setpts=PTS-STARTPTS,scale=1080:1920[before]',
          '[1:v]setpts=PTS-STARTPTS,scale=1080:1920[after]',
          '[before][after]concat=n=2:v=1:a=0[out]',
        ])
        .outputOptions(['-map', '[out]'])
        .output(outputPath)
        .on('end', async () => {
          try {
            const videoUrl = await this.cloudinaryService.uploadVideo(outputPath);
            fs.unlinkSync(outputPath);
            resolve(videoUrl);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (err) => reject(err))
        .run();
    });
  }

  async addMusic(videoUrl: string, musicUrl: string): Promise<string> {
    const outputPath = path.join(__dirname, '../../../uploads', `${Date.now()}-with-music.mp4`);

    return new Promise((resolve, reject) => {
      fluentFfmpg()
        .input(videoUrl)
        .input(musicUrl)
        .outputOptions([
          '-c:v', 'copy',
          '-c:a', 'aac',
        ])
        .output(outputPath)
        .on('end', async () => {
          try {
            const resultUrl = await this.cloudinaryService.uploadVideo(outputPath);
            fs.unlinkSync(outputPath);
            resolve(resultUrl);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (err) => reject(err))
        .run();
    });
  }
}
