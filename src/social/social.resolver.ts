import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { SocialService } from './social.service';
import { SocialAccount } from './schemas/social.schema';
import { CreateSocialDto } from './dto/create-social.dto';

@Resolver(() => SocialAccount)
export class SocialResolver {
  constructor(private readonly socialService: SocialService) {}

  @Query(() => [SocialAccount])
  async socialAccounts(
    @Args('accountId', { type: () => ID, nullable: true }) accountId?: string,
  ): Promise<SocialAccount[]> {
    if (accountId) {
      return this.socialService.findByAccount(accountId);
    }
    return this.socialService.findAll();
  }

  @Mutation(() => SocialAccount)
  async connectSocial(
    @Args('input') createSocialDto: CreateSocialDto,
  ): Promise<SocialAccount> {
    return this.socialService.create(createSocialDto);
  }
}
