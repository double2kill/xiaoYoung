import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BusinessCardModule } from './business-card/business-card.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user.module';
import { EventsModule } from './modules/events.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './schemas/group.schema';
import { GroupMember, GroupMemberSchema } from './schemas/group-member.schema';
import { User, UserSchema } from './schemas/user.schema';
import { Event, EventSchema } from './schemas/event.schema';
import { Dynamic, DynamicSchema } from './schemas/dynamic.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { GroupsController } from './controllers/groups.controller';
import { DynamicsController } from './controllers/dynamics.controller';
import { MessagesController } from './controllers/messages.controller';
import { GroupsService } from './services/groups.service';
import { GroupMembersService } from './services/group-members.service';
import { EventsService } from './services/events.service';
import { DynamicsService } from './services/dynamics.service';
import { MessagesService } from './services/messages.service';

@Module({
  imports: [
    DatabaseModule,
    BusinessCardModule,
    UserModule,
    EventsModule,
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: GroupMember.name, schema: GroupMemberSchema },
      { name: User.name, schema: UserSchema },
      { name: Event.name, schema: EventSchema },
      { name: Dynamic.name, schema: DynamicSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [
    AppController,
    GroupsController,
    DynamicsController,
    MessagesController,
  ],
  providers: [
    AppService,
    GroupsService,
    GroupMembersService,
    EventsService,
    DynamicsService,
    MessagesService,
  ],
})
export class AppModule {}
