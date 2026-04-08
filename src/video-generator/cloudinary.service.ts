import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'cardetl/images',
          transformation: [{ width: 1080, height: 1920, crop: 'fill' }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result?.secure_url || '');
        },
      );
      fs.createReadStream(filePath).pipe(uploadStream);
    });
  }

  async uploadImageFromUrl(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        imageUrl,
        {
          folder: 'cardetl/images',
          transformation: [{ width: 1080, height: 1920, crop: 'fill' }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result?.secure_url || '');
        },
      );
    });
  }

  async uploadVideo(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'cardetl/videos',
          resource_type: 'video',
          transformation: [
            { width: 1080, height: 1920, crop: 'fill' },
            { quality: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result?.secure_url || '');
        },
      );
      fs.createReadStream(filePath).pipe(uploadStream);
    });
  }

  async uploadVideoFromUrl(videoUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        videoUrl,
        {
          folder: 'cardetl/videos',
          resource_type: 'video',
          transformation: [
            { width: 1080, height: 1920, crop: 'fill' },
            { quality: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result?.secure_url || '');
        },
      );
    });
  }
}
