import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';

export type VehicleDocument = Vehicle & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Vehicle {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  licensePlate: string;

  @Field()
  @Prop({ required: true })
  make: string;

  @Field()
  @Prop({ required: true })
  model: string;

  @Field()
  @Prop({ required: true })
  color: string;

  @Field({ nullable: true })
  @Prop()
  beforeImage: string;

  @Field({ nullable: true })
  @Prop()
  afterImage: string;

  @Field(() => ID)
  @Prop({ required: true })
  detailerId: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
