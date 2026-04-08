import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @MessagePattern('accounts.findAll')
  async findAll() {
    return this.accountsService.findAll();
  }

  @MessagePattern('accounts.create')
  async create(@Payload() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }
}
