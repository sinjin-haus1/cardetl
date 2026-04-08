import { IsString, IsOptional, IsUrl } from 'class-validator';
import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateVehicleDto {
  @Field()
  @IsString()
  licensePlate: string;

  @Field()
  @IsString()
  make: string;

  @Field()
  @IsString()
  model: string;

  @Field()
  @IsString()
  color: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  beforeImage?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  afterImage?: string;

  @Field(() => ID)
  @IsString()
  detailerId: string;
}
