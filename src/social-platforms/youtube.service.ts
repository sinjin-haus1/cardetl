import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface YouTubeTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}

interface YouTubeChannel {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
    };
  };
  contentDetails: {
    relatedPlaylists: {
      uploads: string;
    };
  };
}

@Injectable()
export class YouTubeService {
  private readonly API_BASE = 'https://www.googleapis.com/youtube/v3';
  private readonly UPLOAD_BASE = 'https://www.googleapis.com/upload/youtube/v3';
  
  constructor(private readonly configService: ConfigService) {}

  /**
   * Get YouTube OAuth authorization URL
   */
  getAuthUrl(state: string): string {
    const clientId = this.configService.get<string>('YOUTUBE_CLIENT_ID');
    const redirectUri = this.configService.get<string>('YOUTUBE_REDIRECT_URI');
    
    const scopes = [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly',
    ].join(' ');

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scopes,
      access_type: 'offline',
      prompt: 'consent',
      state,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForToken(code: string): Promise<YouTubeTokens> {
    const clientId = this.configService.get<string>('YOUTUBE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('YOUTUBE_CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('YOUTUBE_REDIRECT_URI');

    const response = await axios.post(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    return response.data;
  }

  /**
   * Get user's YouTube channel
   */
  async getChannel(accessToken: string): Promise<YouTubeChannel> {
    const response = await axios.get(`${this.API_BASE}/channels`, {
      params: {
        part: 'snippet,contentDetails',
        mine: 'true',
      },
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    return response.data.items[0];
  }

  /**
   * Get uploads playlist ID
   */
  getUploadsPlaylistId(channel: YouTubeChannel): string {
    return channel.contentDetails.relatedPlaylists.uploads;
  }

  /**
   * Upload video and publish as short
   */
  async uploadShort(
    accessToken: string,
    videoBuffer: Buffer,
    title: string,
    description: string,
    tags: string[] = [],
  ): Promise<{ videoId: string }> {
    // Step 1: Initialize upload
    const initiateResponse = await axios.post(
      `${this.UPLOAD_BASE}/videos`,
      {
        snippet: {
          title,
          description,
          tags,
          categoryId: '22', // People & Blogs
        },
        status: {
          privacyStatus: 'public',
          madeForKids: false,
        },
      },
      {
        params: { uploadType: 'resumable' },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Goog-Upload-Protocol': 'resumable',
          'X-Goog-Upload-Command': 'start',
          'X-Goog-Upload-Content-Length': videoBuffer.length,
        },
      }
    );

    const uploadUrl = initiateResponse.headers['x-goog-upload-url'];

    // Step 2: Upload video data
    await axios.post(uploadUrl, videoBuffer, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'video/mp4',
        'X-Goog-Upload-Protocol': 'raw',
        'X-Goog-Upload-Offset': '0',
      },
    });

    // Video ID is in the response from initiate
    return { videoId: initiateResponse.data.id };
  }

  /**
   * Upload from URL (for Cloudinary URLs)
   */
  async uploadFromUrl(
    accessToken: string,
    videoUrl: string,
    title: string,
    description: string,
    tags: string[] = [],
  ): Promise<{ videoId: string }> {
    // Download video from URL
    const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    const videoBuffer = Buffer.from(videoResponse.data);

    return this.uploadShort(accessToken, videoBuffer, title, description, tags);
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<YouTubeTokens> {
    const clientId = this.configService.get<string>('YOUTUBE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('YOUTUBE_CLIENT_SECRET');

    const response = await axios.post(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams({
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    return {
      ...response.data,
      refresh_token: refreshToken, // Refresh token doesn't change
    };
  }

  /**
   * Get video details
   */
  async getVideo(accessToken: string, videoId: string): Promise<any> {
    const response = await axios.get(`${this.API_BASE}/videos`, {
      params: {
        part: 'snippet,statistics,status',
        id: videoId,
      },
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    return response.data.items[0];
  }

  /**
   * Add shorts to video (YouTube Shorts are just regular videos with specific properties)
   * Note: YouTube doesn't have a separate "Shorts" API - they appear in search/reels based on vertical format
   */
  async optimizeForShorts(title: string, description: string): { optimizedTitle: string; optimizedDescription: string } {
    return {
      optimizedTitle: title.length > 100 ? title.substring(0, 97) + '...' : title,
      optimizedDescription: description + '\n\n#Shorts #CarDetailing #CarTransformation',
    };
  }
}
