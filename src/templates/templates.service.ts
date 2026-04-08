import { Injectable } from '@nestjs/common';
import { Template, MusicStyle, TextStyle } from './schemas/template.schema';
import { Document, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseModule } from '@nestjs/mongoose';

@Injectable()
export class TemplatesService {
  private readonly presets: Array<{
    name: string;
    slug: string;
    musicStyle: MusicStyle;
    textStyle: TextStyle;
    colorPalette: { primary: string[]; accent: string[] };
    kenBurnsConfig: { enabled: boolean; duration: number; zoomFactor: number };
  }> = [
    {
      name: 'SHOWROOM',
      slug: 'showroom',
      musicStyle: MusicStyle.EPIC,
      textStyle: TextStyle.CINEMATIC,
      colorPalette: {
        primary: ['#1a1a2e', '#16213e', '#0f3460'],
        accent: ['#e94560', '#ff6b6b'],
      },
      kenBurnsConfig: {
        enabled: true,
        duration: 8000,
        zoomFactor: 1.2,
      },
    },
    {
      name: 'CLEANCREW',
      slug: 'cleancrew',
      musicStyle: MusicStyle.FRESH,
      textStyle: TextStyle.BOLD,
      colorPalette: {
        primary: ['#ffffff', '#f8f9fa', '#e9ecef'],
        accent: ['#00d4ff', '#7fd8be'],
      },
      kenBurnsConfig: {
        enabled: true,
        duration: 6000,
        zoomFactor: 1.15,
      },
    },
    {
      name: 'MIDNIGHT',
      slug: 'midnight',
      musicStyle: MusicStyle.DARK,
      textStyle: TextStyle.NEON,
      colorPalette: {
        primary: ['#0d0d0d', '#1a1a2e', '#16213e'],
        accent: ['#00ff88', '#ff00ff', '#00ffff'],
      },
      kenBurnsConfig: {
        enabled: true,
        duration: 10000,
        zoomFactor: 1.3,
      },
    },
    {
      name: 'FAMILY',
      slug: 'family',
      musicStyle: MusicStyle.WARM,
      textStyle: TextStyle.FRIENDLY,
      colorPalette: {
        primary: ['#fff5e6', '#ffe4c4', '#ffd700'],
        accent: ['#ff8c00', '#228b22'],
      },
      kenBurnsConfig: {
        enabled: false,
        duration: 5000,
        zoomFactor: 1.1,
      },
    },
    {
      name: 'BUDGET',
      slug: 'budget',
      musicStyle: MusicStyle.UPBEAT,
      textStyle: TextStyle.MINIMAL,
      colorPalette: {
        primary: ['#2d3436', '#636e72', '#b2bec3'],
        accent: ['#e17055', '#fdcb6e'],
      },
      kenBurnsConfig: {
        enabled: false,
        duration: 4000,
        zoomFactor: 1.05,
      },
    },
  ];

  constructor(
    @InjectModel('Template') private templateModel: Model<Template & Document>,
  ) {}

  async findAll(): Promise<Template[]> {
    const templates = await this.templateModel.find().exec();
    if (templates.length === 0) {
      await this.seedPresets();
      return this.templateModel.find().exec();
    }
    return templates;
  }

  async findBySlug(slug: string): Promise<Template> {
    return this.templateModel.findOne({ slug }).exec();
  }

  async seedPresets(): Promise<void> {
    for (const preset of this.presets) {
      const exists = await this.templateModel.findOne({ slug: preset.slug }).exec();
      if (!exists) {
        const template = new this.templateModel(preset);
        await template.save();
      }
    }
  }
}
