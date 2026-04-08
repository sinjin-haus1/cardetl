import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

export type TransformationDocument = Transformation & Document;

export enum TransformationStatus {
  PENDING = 'PENDING',
  RENDERING = 'RENDERING',
  DONE = 'DONE',
  FAILED = 'FAILED',
}

registerEnumType(TransformationStatus, { name: 'TransformationStatus' });

@ObjectType()
@Schema({ timestamps: true })
export class Transformation {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ required: true })
  vehicleId: string;

  @Field({ nullable: true })
  @Prop()
  beforeUrl: string;

  @Field({ nullable: true })
  @Prop()
  afterUrl: string;

  @Field(() => TransformationStatus)
  @Prop({ required: true, default: TransformationStatus.PENDING })
  status: TransformationStatus;

  @Field()
  createdAt: Date;
}

export const TransformationSchema = SchemaFactory.createForClass(Transformation);
