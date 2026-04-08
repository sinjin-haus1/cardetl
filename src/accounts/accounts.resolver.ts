import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AccountsService } from './accounts.service';
import { Account } from './schemas/account.schema';
import { CreateAccountDto } from './dto/create-account.dto';

@Resolver(() => Account)
export class AccountsResolver {
  constructor(private readonly accountsService: AccountsService) {}

  @Query(() => [Account])
  async accounts(): Promise<Account[]> {
    return this.accountsService.findAll();
  }

  @Mutation(() => Account)
  async createAccount(
    @Args('input') createAccountDto: CreateAccountDto,
  ): Promise<Account> {
    return this.accountsService.create(createAccountDto);
  }
}
