import { IsString, IsOptional, IsArray, IsUrl, IsEnum } from 'class-validator';
import { InputType, Field, ID } from '@nestjs/graphql';
import { VideoPlatform } from '../schemas/video.schema';

@InputType()
export class CreateVideoDto {
  @Field(() => ID)
  @IsString()
  transformationId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  platformVideoId?: string;

  @Field(() => VideoPlatform, { nullable: true })
  @IsOptional()
  @IsEnum(VideoPlatform)
  platform?: VideoPlatform;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  hook?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  hashtags?: string[];
}
