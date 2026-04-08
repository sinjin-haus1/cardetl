import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TemplateDocument = Template & Document;

export enum MusicStyle {
  EPIC = 'EPIC',
  FRESH = 'FRESH',
  DARK = 'DARK',
  WARM = 'WARM',
  UPBEAT = 'UPBEAT',
}

registerEnumType(MusicStyle, { name: 'MusicStyle' });

export enum TextStyle {
  CINEMATIC = 'CINEMATIC',
  BOLD = 'BOLD',
  NEON = 'NEON',
  FRIENDLY = 'FRIENDLY',
  MINIMAL = 'MINIMAL',
}

registerEnumType(TextStyle, { name: 'TextStyle' });

@ObjectType()
@Schema()
export class KenBurnsConfig {
  @Field()
  enabled: boolean;

  @Field()
  duration: number;

  @Field()
  zoomFactor: number;
}

@ObjectType()
@Schema()
export class ColorPalette {
  @Field(() => [String])
  primary: string[];

  @Field(() => [String])
  accent: string[];
}

@ObjectType()
@Schema()
export class Template {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true, unique: true })
  slug: string;

  @Field(() => MusicStyle)
  @Prop({ required: true })
  musicStyle: MusicStyle;

  @Field(() => TextStyle)
  @Prop({ required: true })
  textStyle: TextStyle;

  @Field(() => ColorPalette)
  @Prop({ type: ColorPalette, required: true })
  colorPalette: ColorPalette;

  @Field(() => KenBurnsConfig)
  @Prop({ type: KenBurnsConfig, required: true })
  kenBurnsConfig: KenBurnsConfig;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
