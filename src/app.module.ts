import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';

import { AccountsModule } from './accounts/accounts.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { TransformationsModule } from './transformations/transformations.module';
import { VideosModule } from './videos/videos.module';
import { SocialModule } from './social/social.module';
import { TemplatesModule } from './templates/templates.module';
import { VideoGeneratorModule } from './video-generator/video-generator.module';
import { SocialPlatformsModule } from './social-platforms/social-platforms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
    }),
    AccountsModule,
    VehiclesModule,
    TransformationsModule,
    VideosModule,
    SocialModule,
    TemplatesModule,
    VideoGeneratorModule,
    SocialPlatformsModule,
  ],
})
export class AppModule {}
