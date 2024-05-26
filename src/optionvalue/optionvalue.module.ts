import { Module } from '@nestjs/common';
import { OptionvalueService } from './optionvalue.service';
import { OptionvalueController } from './optionvalue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Optionvalue } from 'src/optionvalue/entities/optionvalue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Optionvalue])],
  controllers: [OptionvalueController],
  providers: [OptionvalueService],
})
export class OptionvalueModule { }
