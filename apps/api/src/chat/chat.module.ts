import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { PubSub } from 'graphql-subscriptions';
import { PubsubService } from './pubsub.service';
import { PrismaModule } from '../prisma/prisma.module';

export const PUB_SUB = Symbol('PUB_SUB');

@Module({
  imports: [PrismaModule],
  providers: [
    ChatResolver,
    ChatService,
    {
      provide: PUB_SUB,
      useFactory: () => {
        return new PubSub();
      },
      inject: [],
    },
    {
      provide: PubsubService,
      useFactory: (pubsub) => pubsub,
      inject: [PUB_SUB],
    },
  ],
})
export class ChatModule {}
