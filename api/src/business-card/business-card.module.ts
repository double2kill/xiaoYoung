import { Module } from '@nestjs/common';
import { BusinessCardController } from './business-card.controller';
import { BusinessCardService } from './business-card.service';

@Module({
  controllers: [BusinessCardController],
  providers: [BusinessCardService],
  exports: [BusinessCardService],
})
export class BusinessCardModule {}
