import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TransformationsService } from './transformations.service';
import { Transformation } from './schemas/transformation.schema';
import { CreateTransformationDto } from './dto/create-transformation.dto';

@Resolver(() => Transformation)
export class TransformationsResolver {
  constructor(private readonly transformationsService: TransformationsService) {}

  @Query(() => [Transformation])
  async transformations(
    @Args('vehicleId', { type: () => ID, nullable: true }) vehicleId?: string,
  ): Promise<Transformation[]> {
    if (vehicleId) {
      return this.transformationsService.findByVehicle(vehicleId);
    }
    return this.transformationsService.findAll();
  }

  @Query(() => Transformation, { nullable: true })
  async transformation(@Args('id', { type: () => ID }) id: string): Promise<Transformation> {
    return this.transformationsService.findOne(id);
  }

  @Mutation(() => Transformation)
  async createTransformation(
    @Args('input') createTransformationDto: CreateTransformationDto,
  ): Promise<Transformation> {
    return this.transformationsService.create(createTransformationDto);
  }
}
