import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class GeneratePromptDto {
  @ApiProperty({
    example: 'A quarterly sales report for the EMEA region',
    description: 'Free-text instruction for the model',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(8000)
  prompt!: string;

  @ApiPropertyOptional({
    example: 'pdf',
    enum: ['pdf', 'ppt'],
    description: 'Which document shape to draft against. Defaults to "pdf".',
  })
  @IsOptional()
  @IsIn(['pdf', 'ppt'])
  format?: 'pdf' | 'ppt';
}
