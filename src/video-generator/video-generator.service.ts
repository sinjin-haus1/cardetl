import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fluentFfmpg from 'fluent-ffmpeg';
import * as ffmpegStatic from 'ffmpeg-static';
import * as path from 'path';
import * as fs from 'fs';
import { CloudinaryService } from './cloudinary.service';

interface KenBurnsConfig {
  beforeStart: string;
  beforeEnd: string;
  afterStart: string;
  afterEnd: string;
}

@Injectable()
export class VideoGeneratorService {
  private readonly KEN_BURNS_DURATION = 3; // seconds per image
  private readonly TRANSITION_DURATION = 0.5;

  constructor(
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    fluentFfmpg.setFfmpegPath(ffmpegStatic as string);
  }

  /**
   * Renders a transformation video with Ken Burns pan/zoom effects
   * Before image: zooms in from bottom-left to top-right
   * After image: zooms in from top-right to bottom-left
   * Crossfade transition between them
   */
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

    const kenBurnsConfig = this.getKenBurnsForTemplate(templateSlug);

    return new Promise((resolve, reject) => {
      fluentFfmpg()
        // Before image with Ken Burns zoom-in effect
        .input(beforeImageUrl)
        .input(afterImageUrl)
        .inputsFormat('image2')
        .complexFilter([
          // Scale and pad before image to 1080x1920 (9:16 aspect ratio)
          '[0:v]scale=2160:3840:force_original_aspect_ratio=increase,crop=2160:3840,pad=2160:3840:(ow-iw)/2:(oh-ih)/2:color=black[before_scaled]',
          // Scale and pad after image to 1080x1920
          '[1:v]scale=2160:3840:force_original_aspect_ratio=increase,crop=2160:3840,pad=2160:3840:(ow-iw)/2:(oh-ih)/2:color=black[after_scaled]',
          
          // Ken Burns on before: zoom in (1.0 -> 1.15) from bottom-left to top-right
          '[before_scaled]zoompan=z=\'min(zoom+0.003,1.15)\':d=\'${this.KEN_BURNS_DURATION * 30}\':s=1080x1920:x=\'if(between(on,0,${this.KEN_BURNS_DURATION * 15}),200,if(between(on,${this.KEN_BURNS_DURATION * 15},${this.KEN_BURNS_DURATION * 30}),(iw-ow)*0.9,200))\':y=\'if(between(on,0,${this.KEN_BURNS_DURATION * 15}),(ih-oh)*0.9,if(between(on,${this.KEN_BURNS_DURATION * 15},${this.KEN_BURNS_DURATION * 30}),100,(ih-oh)*0.9))\':r=30:enable=\'lt(t,${this.KEN_BURNS_DURATION})\'[before_kb]',
          
          // Ken Burns on after: zoom in (1.0 -> 1.15) from top-right to bottom-left  
          '[after_scaled]zoompan=z=\'min(zoom+0.003,1.15)\':d=\'${this.KEN_BURNS_DURATION * 30}\':s=1080x1920:x=\'if(between(on,0,${this.KEN_BURNS_DURATION * 15}),(iw-ow)*0.9,if(between(on,${this.KEN_BURNS_DURATION * 15},${this.KEN_BURNS_DURATION * 30}),200,(iw-ow)*0.9))\':y=\'if(between(on,0,${this.KEN_BURNS_DURATION * 15}),100,if(between(on,${this.KEN_BURNS_DURATION * 15},${this.KEN_BURNS_DURATION * 30}),(ih-oh)*0.9,100))\':r=30:enable=\'lt(t,${this.KEN_BURNS_DURATION})\'[after_kb]',

          // Overlay with crossfade - before first, then fade to after
          '[before_kb][after_kb]overlay=0:0:format=auto:enable=\'between(t,${this.KEN_BURNS_DURATION - this.TRANSITION_DURATION},${this.KEN_BURNS_DURATION + this.TRANSITION_DURATION})\':alpha=\'if(lt(t,${this.KEN_BURNS_DURATION}),1,max(0,(${this.KEN_BURNS_DURATION + this.TRANSITION_DURATION}-t)/${this.TRANSITION_DURATION}))\'[out]',
        ])
        .outputOptions(['-map', '[out]', '-t', String(this.KEN_BURNS_DURATION * 2)])
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

  /**
   * Simpler but more reliable Ken Burns effect using scale and drawgraph
   */
  async renderTransformationWithKenBurns(
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
      // Using a simpler approach with zoompan filter
      fluentFfmpg()
        .input(beforeImageUrl)
        .input(afterImageUrl)
        .inputsFormat('image2')
        .complexFilter([
          // Before image: zoom in from 1.0 to 1.2 over 3 seconds, moving from bottom-left to center
          '[0:v]scale=2160:3840,crop=2160:3840,zoompan=z=\'min(zoom+0.0007,1.2)\':x=\'if(lte(zoom,1.0),iw/2-(ow/zoom)/2,iw/2-(ow/zoom)/2+100)\':y=\'if(lte(zoom,1.0),ih/2-(oh/zoom)/2,ih/2-(oh/zoom)/2-50)\':d=90:s=1080x1920:r=30[before_kb]',
          
          // After image: zoom in from 1.0 to 1.2 over 3 seconds, moving from top-right to center  
          '[1:v]scale=2160:3840,crop=2160:3840,zoompan=z=\'min(zoom+0.0007,1.2)\':x=\'if(lte(zoom,1.0),iw/2-(ow/zoom)/2,iw/2-(ow/zoom)/2-100)\':y=\'if(lte(zoom,1.0),ih/2-(oh/zoom)/2,ih/2-(oh/zoom)/2+50)\':d=90:s=1080x1920:r=30[after_kb]',
          
          // Concatenate with crossfade
          '[before_kb]fade=t=out:st=2.5:d=0.5[before_fade]',
          '[after_kb]fade=t=in:st=0:d=0.5[after_fade]',
          '[before_fade][after_fade]concat=n=2:v=1:a=0:enable=\'between(t,0,6)\'[out]',
        ])
        .outputOptions(['-map', '[out]', '-t', '6', '-r', '30'])
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

  private getKenBurnsForTemplate(templateSlug: string): KenBurnsConfig {
    const presets: Record<string, KenBurnsConfig> = {
      SHOWROOM: {
        beforeStart: 'center',
        beforeEnd: 'top-right',
        afterStart: 'bottom-left',
        afterEnd: 'center',
      },
      CLEANCREW: {
        beforeStart: 'left',
        beforeEnd: 'right',
        afterStart: 'right', 
        afterEnd: 'left',
      },
      MIDNIGHT: {
        beforeStart: 'top-left',
        beforeEnd: 'bottom-right',
        afterStart: 'bottom-right',
        afterEnd: 'top-left',
      },
      FAMILY: {
        beforeStart: 'bottom',
        beforeEnd: 'center',
        afterStart: 'top',
        afterEnd: 'center',
      },
      BUDGET: {
        beforeStart: 'center',
        beforeEnd: 'zoom-in',
        afterStart: 'zoom-out',
        afterEnd: 'center',
      },
    };
    
    return presets[templateSlug] || presets.SHOWROOM;
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
