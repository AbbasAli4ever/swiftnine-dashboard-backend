import { Module } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { S3Service } from './s3/s3.service';

@Module({
  providers: [EmailService, S3Service],
  exports: [EmailService, S3Service],
})
export class CommonModule {}
