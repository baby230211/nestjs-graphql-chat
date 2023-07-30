import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Message } from './message.model';

@ObjectType()
export class Conversation {
  @Field(() => ID)
  public id!: string;

  @Field(() => ID)
  public name!: string;

  @Field(() => ID)
  public creatorId!: string;

  @Field(() => GraphQLISODateTime)
  public createdAt!: Date;

  @Field(() => [Message])
  public messages!: Message[];
}
