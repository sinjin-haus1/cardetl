import { IsString, IsOptional, IsEnum } from 'class-validator';
import { InputType, Field, ID } from '@nestjs/graphql';
import { SocialPlatform } from '../schemas/social.schema';

@InputType()
export class CreateSocialDto {
  @Field(() => ID)
  @IsString()
  accountId: string;

  @Field(() => SocialPlatform)
  @IsEnum(SocialPlatform)
  platform: SocialPlatform;

  @Field()
  @IsString()
  accessToken: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  refreshToken?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  platformUserId?: string;
}
