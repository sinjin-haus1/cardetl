import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface InstagramTokens {
  access_token: string;
  expires_in: number;
}

interface InstagramUser {
  id: string;
  username: string;
  name: string;
  account_type: string;
}

@Injectable()
export class InstagramService {
  private readonly API_BASE = 'https://graph.instagram.com';
  private readonly API_VERSION = 'v18.0';
  
  constructor(private readonly configService: ConfigService) {}

  /**
   * Get Instagram Graph API OAuth authorization URL
   */
  getAuthUrl(state: string): string {
    const clientId = this.configService.get<string>('INSTAGRAM_CLIENT_ID');
    const redirectUri = this.configService.get<string>('INSTAGRAM_REDIRECT_URI');
    
    const scopes = [
      'instagram_basic',
      'instagram_content_publish',
      'pages_show_list',
      'pages_read_engagement',
    ].join(',');

    return `https://www.facebook.com/${this.API_VERSION}/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&response_type=code&state=${state}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<string> {
    const clientId = this.configService.get<string>('INSTAGRAM_CLIENT_ID');
    const clientSecret = this.configService.get<string>('INSTAGRAM_CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('INSTAGRAM_REDIRECT_URI');

    // Exchange code for long-lived token via Graph API
    const response = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      },
    });

    return response.data.access_token;
  }

  /**
   * Get Instagram business account ID
   */
  async getBusinessAccount(accessToken: string): Promise<string> {
    // Get associated Facebook Page
    const pagesResponse = await axios.get('https://graph.facebook.com/v18.0/me/accounts', {
      params: { access_token: accessToken },
    });

    if (!pagesResponse.data.data || pagesResponse.data.data.length === 0) {
      throw new Error('No Facebook Page associated with this Instagram account');
    }

    const pageToken = pagesResponse.data.data[0].access_token;
    const pageId = pagesResponse.data.data[0].id;

    // Get Instagram business account linked to the page
    const igResponse = await axios.get(`https://graph.facebook.com/v18.0/${pageId}`, {
      params: {
        fields: 'instagram_business_account',
        access_token: pageToken,
      },
    });

    if (!igResponse.data.instagram_business_account) {
      throw new Error('No Instagram business account linked to this page');
    }

    return igResponse.data.instagram_business_account.id;
  }

  /**
   * Get user profile info
   */
  async getUserProfile(igAccountId: string, accessToken: string): Promise<InstagramUser> {
    const response = await axios.get(`${this.API_BASE}/${this.API_VERSION}/${igAccountId}`, {
      params: {
        fields: 'id,username,name,account_type,profile_picture_url',
        access_token: accessToken,
      },
    });

    return response.data;
  }

  /**
   * Create a container for video upload
   */
  async createContainer(
    igAccountId: string,
    accessToken: string,
    videoUrl: string,
    caption: string,
  ): Promise<{ id: string }> {
    const response = await axios.post(
      `${this.API_BASE}/${this.API_VERSION}/${igAccountId}/media`,
      {
        media_type: 'REELS',
        video_url: videoUrl,
        caption,
      },
      {
        params: { access_token: accessToken },
      }
    );

    return { id: response.data.id };
  }

  /**
   * Publish media from container
   */
  async publishMedia(igAccountId: string, accessToken: string, creationId: string): Promise<{ id: string }> {
    const response = await axios.post(
      `${this.API_BASE}/${this.API_VERSION}/${igAccountId}/media_publish`,
      { creation_id: creationId },
      {
        params: { access_token: accessToken },
      }
    );

    return { id: response.data.id };
  }

  /**
   * Upload and publish a reel
   */
  async uploadReel(
    igAccountId: string,
    accessToken: string,
    videoUrl: string,
    caption: string,
    hashtags: string[] = [],
  ): Promise<{ id: string }> {
    // Add hashtags to caption
    const hashtagString = hashtags.length > 0 ? '\n\n' + hashtags.map(t => `#${t}`).join(' ') : '';
    const fullCaption = caption + hashtagString;

    // Create container
    const { id: containerId } = await this.createContainer(igAccountId, accessToken, videoUrl, fullCaption);

    // Wait for processing
    await this.waitForMediaReady(igAccountId, accessToken, containerId);

    // Publish
    return this.publishMedia(igAccountId, accessToken, containerId);
  }

  /**
   * Poll until media is ready for publishing
   */
  private async waitForMediaReady(igAccountId: string, accessToken: string, containerId: string, maxAttempts = 20): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await axios.get(`${this.API_BASE}/${this.API_VERSION}/${containerId}`, {
        params: {
          fields: 'status,error_code',
          access_token: accessToken,
        },
      });

      if (response.data.status === 'FINISHED') {
        return;
      }

      if (response.data.status === 'ERROR') {
        throw new Error(`Instagram media processing failed: ${response.data.error_code}`);
      }

      // Wait 2 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    throw new Error('Instagram media processing timed out');
  }

  /**
   * Refresh access token (long-lived tokens last 60 days)
   */
  async refreshToken(accessToken: string): Promise<string> {
    const clientId = this.configService.get<string>('INSTAGRAM_CLIENT_ID');
    const clientSecret = this.configService.get<string>('INSTAGRAM_CLIENT_SECRET');

    const response = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: clientId,
        client_secret: clientSecret,
        fb_exchange_token: accessToken,
      },
    });

    return response.data.access_token;
  }
}
