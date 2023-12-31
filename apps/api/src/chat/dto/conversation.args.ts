import { ArgsType, Field, ID } from '@nestjs/graphql';

@ArgsType()
export class ConversationArgs {
  @Field(() => ID)
  creatorId: string;
  @Field(() => String)
  name: string;
}
