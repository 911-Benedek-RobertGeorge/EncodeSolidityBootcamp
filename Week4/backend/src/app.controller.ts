import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { MintTokenDto } from './dtos/mintToken.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  async test() {
    return { result: this.appService.test() };
  }

  @Get('contract-address')
  getContractAddress() {
    return { result: this.appService.getContractAddress() };
  }

  @Get('server-wallet-address')
  async getServerWalletAddress() {
    return { result: this.appService.getServerWalletAddress() };
  }

  @Get('token-balance/:address')
  async getTokenBalance(@Param('address') address: string) {
    return { result: await this.appService.getTokenBalance(address) };
  }

  @Get('check-minter-role')
  async checkMinterRole(@Query('address') address: string) {
    return { result: await this.appService.checkMinterRole(address) };
  }

  @Post('mint-tokens')
  async mintTokens(@Body() body: MintTokenDto) {
    return {
      result: await this.appService.mintTokens(body.address, body.amount),
    };
  }

  @Get('recent-votes')
  async recentVotes() {
    return {result: await this.appService.getRecentVotes()};
  }


}
