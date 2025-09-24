import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BusinessCardModule } from './business-card/business-card.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AlumniGroup, AlumniGroupSchema } from './schemas/alumni-group.schema';
import { CommunityController } from './controllers/community.controller';
import { CommunityService } from './services/community.service';

@Module({
  imports: [
    DatabaseModule,
    BusinessCardModule,
    UserModule,
    MongooseModule.forFeature([
      { name: AlumniGroup.name, schema: AlumniGroupSchema },
    ]),
  ],
  controllers: [AppController, CommunityController],
  providers: [AppService, CommunityService],
})
export class AppModule {}
