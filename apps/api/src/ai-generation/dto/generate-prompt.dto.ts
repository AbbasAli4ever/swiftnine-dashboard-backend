import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class GeneratePromptDto {
  @ApiProperty({
    example: 'A quarterly sales report for the EMEA region',
    description: 'Free-text instruction for the model',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(8000)
  prompt!: string;
}
