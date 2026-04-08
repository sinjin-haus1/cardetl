import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

export type VideoDocument = Video & Document;

export enum VideoPlatform {
  TIKTOK = 'TIKTOK',
  INSTAGRAM = 'INSTAGRAM',
  YOUTUBE = 'YOUTUBE',
}

registerEnumType(VideoPlatform, { name: 'VideoPlatform' });

export enum VideoStatus {
  PENDING = 'PENDING',
  RENDERING = 'RENDERING',
  DONE = 'DONE',
  FAILED = 'FAILED',
}

registerEnumType(VideoStatus, { name: 'VideoStatus' });

@ObjectType()
@Schema({ timestamps: true })
export class Video {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ required: true })
  transformationId: string;

  @Field({ nullable: true })
  @Prop()
  videoUrl: string;

  @Field({ nullable: true })
  @Prop()
  platformVideoId: string;

  @Field(() => VideoPlatform, { nullable: true })
  @Prop()
  platform: VideoPlatform;

  @Field(() => VideoStatus)
  @Prop({ required: true, default: VideoStatus.PENDING })
  status: VideoStatus;

  @Field({ nullable: true })
  @Prop()
  hook: string;

  @Field(() => [String], { nullable: true })
  @Prop({ type: [String] })
  hashtags: string[];
}

export const VideoSchema = SchemaFactory.createForClass(Video);
