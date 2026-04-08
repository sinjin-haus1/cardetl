import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface TikTokTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

interface TikTokUserInfo {
  user_id: string;
  display_name: string;
  username: string;
}

@Injectable()
export class TikTokService {
  private readonly API_BASE = 'https://open.tiktokapis.com/v2';
  
  constructor(private readonly configService: ConfigService) {}

  /**
   * Get TikTok OAuth authorization URL
   */
  getAuthUrl(state: string): string {
    const clientKey = this.configService.get<string>('TIKTOK_CLIENT_KEY');
    const redirectUri = this.configService.get<string>('TIKTOK_REDIRECT_URI');
    
    const scopes = [
      'user.info.basic',
      'video.upload',
      'video.publish',
      'video.publish.fail',
    ].join(',');

    return `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<TikTokTokens> {
    const clientKey = this.configService.get<string>('TIKTOK_CLIENT_KEY');
    const clientSecret = this.configService.get<string>('TIKTOK_CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('TIKTOK_REDIRECT_URI');

    const response = await axios.post(
      `${this.API_BASE}/oauth/access_token/`,
      {
        client_key: clientKey,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      },
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    return response.data.data;
  }

  /**
   * Get user info
   */
  async getUserInfo(accessToken: string): Promise<TikTokUserInfo> {
    const response = await axios.post(
      `${this.API_BASE}/user/info/`,
      { fields: ['user_id', 'display_name', 'username'] },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data;
  }

  /**
   * Upload video to TikTok
   */
  async uploadVideo(
    accessToken: string,
    videoUrl: string,
    title: string,
    description: string,
  ): Promise<{ video_id: string }> {
    // Step 1: Initialize upload
    const initResponse = await axios.post(
      `${this.API_BASE}/video/upload/init/`,
      {
        title,
        description,
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const uploadId = initResponse.data.data.upload_id;

    // Step 2: Upload video chunk (single chunk for small videos)
    const videoBuffer = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    
    await axios.post(
      `${this.API_BASE}/video/upload/`,
      videoBuffer.data,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'video/mp4',
          'Upload-Offset': '0',
          'Upload-Length': videoBuffer.data.length,
          'Upload-ID': uploadId,
        },
      }
    );

    // Step 3: Publish video
    const publishResponse = await axios.post(
      `${this.API_BASE}/video/publish/`,
      { upload_id: uploadId },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return { video_id: publishResponse.data.data.video_id };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<TikTokTokens> {
    const clientKey = this.configService.get<string>('TIKTOK_CLIENT_KEY');
    const clientSecret = this.configService.get<string>('TIKTOK_CLIENT_SECRET');

    const response = await axios.post(
      `${this.API_BASE}/oauth/refresh_access_token/`,
      new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    return response.data.data;
  }
}
