import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BusinessCardModule } from './business-card/business-card.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user.module';

@Module({
  imports: [DatabaseModule, BusinessCardModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
