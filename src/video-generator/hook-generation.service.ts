import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class HookGenerationService {
  private openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generateViralHook(
    vehicleMake: string,
    vehicleModel: string,
    transformationType: string,
  ): Promise<{ hook: string; hashtags: string[] }> {
    const prompt = `Generate a viral TikTok/Reel hook for a car detailing transformation video. The video shows a ${vehicleMake} ${vehicleModel} being detailed.
    
Transformation type: ${transformationType}

Generate exactly one hook and 5 relevant hashtags. Return in this JSON format only (no markdown, no code blocks):
{"hook": "your hook text here", "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"]}

Make the hook catchy and faceless (no faces shown). Examples of great hooks:
- "POV: You finallyDetail your car and this happens"
- "Before: looked like a tornado hit it. After: dealership ready"
- "Day 1 vs Day 1000 of detailing"
- "She said she'd never forgive me for this... (goodbye stains)"

Hashtags should be relevant to car detailing, automotive, and viral content.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        max_tokens: 200,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        return this.getDefaultHook(vehicleMake, vehicleModel);
      }

      const parsed = JSON.parse(content);
      return {
        hook: parsed.hook || this.getDefaultHook(vehicleMake, vehicleModel).hook,
        hashtags: parsed.hashtags || ['#cardetail', '#carsoftiktok', '#detailing'],
      };
    } catch (error) {
      console.error('Hook generation error:', error);
      return this.getDefaultHook(vehicleMake, vehicleModel);
    }
  }

  private getDefaultHook(vehicleMake: string, vehicleModel: string): { hook: string; hashtags: string[] } {
    return {
      hook: `POV: Your ${vehicleMake} ${vehicleModel} finally gets the detail it deserves`,
      hashtags: [
        '#cardetail',
        '#carsoftiktok',
        '#detailing',
        '#autodetail',
        '#viral',
      ],
    };
  }
}
