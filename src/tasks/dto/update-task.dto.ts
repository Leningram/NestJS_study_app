import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, ValidateIf } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto, {
  skipNullProperties: false,
}) {
  @IsBoolean()
  @ValidateIf((_, value) => value !== undefined)
  completed?: boolean;
}
