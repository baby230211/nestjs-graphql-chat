import { ArgsType, Field, ID } from '@nestjs/graphql';

@ArgsType()
export class MessageArgs {
  @Field(() => ID)
  senderId: string;
  @Field(() => ID)
  conversationId: string;
  @Field(() => String)
  content: string;
}
