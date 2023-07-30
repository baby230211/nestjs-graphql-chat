import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { Message } from './models/message.model';
import { Conversation } from './models/conversation.model';
import { ConversationArgs } from './dto/conversation.args';
import { MessageArgs } from './dto/message.args';
import { PubsubService } from './pubsub.service';
import { ObjectId } from 'bson';
import { BadRequestException } from '@nestjs/common';

@Resolver(() => Conversation)
export class ChatResolver {
  constructor(
    private readonly chatService: ChatService,
    private readonly _pubSubService: PubsubService,
  ) {}
  @ResolveField(() => [Message])
  public async messages(@Parent() conversation: Conversation) {
    const items = await this.chatService.getMessagesByConversationId(
      conversation.id,
    );

    return items || [];
  }

  @ResolveField(() => Message, { nullable: true })
  public async lastMessage(@Parent() conversation: Conversation) {
    console.log('conversation: ', conversation);
    const items = await this.chatService.getLastMessagesByConversationId(
      conversation.id,
    );
    if (!items.length) {
      return null;
    }

    return items[items.length - 1];
  }

  @Query(() => [Conversation])
  public async conversationsList() {
    console.log(`calling conversationsList`);
    return this.chatService.getAllConversationList();
  }

  @Query(() => Conversation)
  public async conversationById(@Args('id', { type: () => ID }) id: string) {
    console.log(`calling conversationById`, { id });
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid conversation Id', {
        cause: new Error(),
      });
    }

    return this.chatService.getConversationById(id);
  }

  @Mutation(() => Conversation)
  public async conversationCreate(@Args() conversationArgs: ConversationArgs) {
    const newConversation =
      this.chatService.createConversation(conversationArgs);
    return newConversation;
  }

  @Mutation(() => Message)
  public async messageCreate(@Args() messageArgs: MessageArgs) {
    if (
      !ObjectId.isValid(messageArgs.conversationId) ||
      !ObjectId.isValid(messageArgs.senderId)
    ) {
      throw new BadRequestException('Invalid Id', {
        cause: new Error(),
      });
    }
    const newMessage = await this.chatService.createMessage(messageArgs);
    void this._pubSubService.publish('NEW_MESSAGE_SENT', newMessage);
    return newMessage;
  }

  @Subscription(() => Message, {
    filter(
      this: ChatResolver,
      newMessage: Message,
      variables: { conversationId: string },
    ) {
      console.log('----filter-----', this, newMessage);

      // Only handle the subscription when conversation exists
      return this.chatService.validateConversation(variables.conversationId);
    },
    resolve: (payload: Message) => payload,
  })
  public onNewMessageSent(
    @Args('conversationId', { type: () => ID }) conversationId: string,
  ) {
    return this._pubSubService.asyncIterator('NEW_MESSAGE_SENT');
  }
}
