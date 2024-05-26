import { PartialType } from '@nestjs/swagger';
import { CreateOptionvalueDto } from './create-optionvalue.dto';

export class UpdateOptionvalueDto extends PartialType(CreateOptionvalueDto) {}
