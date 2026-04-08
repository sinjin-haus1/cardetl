import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

export type SocialAccountDocument = SocialAccount & Document;

export enum SocialPlatform {
  TIKTOK = 'TIKTOK',
  INSTAGRAM = 'INSTAGRAM',
  YOUTUBE = 'YOUTUBE',
}

registerEnumType(SocialPlatform, { name: 'SocialPlatform' });

@ObjectType()
@Schema({ timestamps: true })
export class SocialAccount {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ required: true })
  accountId: string;

  @Field(() => SocialPlatform)
  @Prop({ required: true })
  platform: SocialPlatform;

  @Field()
  @Prop({ required: true })
  accessToken: string;

  @Field({ nullable: true })
  @Prop()
  refreshToken: string;

  @Field({ nullable: true })
  @Prop()
  platformUserId: string;
}

export const SocialAccountSchema = SchemaFactory.createForClass(SocialAccount);
