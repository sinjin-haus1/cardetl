import { IsString, IsOptional, IsUrl } from 'class-validator';
import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateTransformationDto {
  @Field(() => ID)
  @IsString()
  vehicleId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  beforeUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  afterUrl?: string;
}
