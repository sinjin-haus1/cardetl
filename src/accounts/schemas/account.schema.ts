import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';

export type AccountDocument = Account & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Account {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Field()
  @Prop({ required: true })
  plan: string;

  @Field()
  createdAt: Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
