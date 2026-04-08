import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { VehiclesService } from './vehicles.service';
import { Vehicle } from './schemas/vehicle.schema';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@Resolver(() => Vehicle)
export class VehiclesResolver {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Query(() => [Vehicle])
  async vehicles(
    @Args('detailerId', { type: () => ID, nullable: true }) detailerId?: string,
  ): Promise<Vehicle[]> {
    if (detailerId) {
      return this.vehiclesService.findByDetailer(detailerId);
    }
    return this.vehiclesService.findAll();
  }

  @Mutation(() => Vehicle)
  async createVehicle(
    @Args('input') createVehicleDto: CreateVehicleDto,
  ): Promise<Vehicle> {
    return this.vehiclesService.create(createVehicleDto);
  }
}
