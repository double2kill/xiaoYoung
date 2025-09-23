import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BusinessCardModule } from './business-card/business-card.module';

@Module({
  imports: [BusinessCardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
