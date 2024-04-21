import { Controller, Delete, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('seed')
@ApiTags('Seed')
export class SeedController {
  constructor(
    private readonly seedService: SeedService) { }


  @Delete('/reset')
  reInitAll() {
    return this.seedService.reInitAll();
  }

  @Get('/start_v1')
  async startSeed() {
    await this.seedService.startV1();
    console.log('===Finished seed v1')
  }


}
