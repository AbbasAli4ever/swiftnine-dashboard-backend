import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { SseService } from './sse.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, SseService],
  exports: [CommentsService],
})
export class CommentsModule {}
