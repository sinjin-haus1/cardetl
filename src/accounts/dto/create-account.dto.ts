import { IsEmail, IsString, IsOptional } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAccountDto {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  plan: string;
}
