import { Module } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { S3Service } from './s3/s3.service';
import { PublicAssetsS3Service } from './s3/public-assets-s3.service';

@Module({
  providers: [EmailService, S3Service, PublicAssetsS3Service],
  exports: [EmailService, S3Service, PublicAssetsS3Service],
})
export class CommonModule {}
