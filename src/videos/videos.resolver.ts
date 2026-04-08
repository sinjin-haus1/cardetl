import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { VideosService } from './videos.service';
import { Video } from './schemas/video.schema';
import { CreateVideoDto } from './dto/create-video.dto';

@Resolver(() => Video)
export class VideosResolver {
  constructor(private readonly videosService: VideosService) {}

  @Query(() => [Video])
  async videos(
    @Args('transformationId', { type: () => ID, nullable: true }) transformationId?: string,
  ): Promise<Video[]> {
    if (transformationId) {
      return this.videosService.findByTransformation(transformationId);
    }
    return this.videosService.findAll();
  }

  @Mutation(() => Video)
  async createVideo(
    @Args('input') createVideoDto: CreateVideoDto,
  ): Promise<Video> {
    return this.videosService.create(createVideoDto);
  }
}
