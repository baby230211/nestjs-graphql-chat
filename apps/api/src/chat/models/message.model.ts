import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Message {
  @Field(() => ID)
  public id!: string;

  @Field(() => ID)
  public conversationId!: string;

  @Field(() => ID)
  public senderId!: string;

  @Field(() => String)
  public content!: string;

  @Field(() => GraphQLISODateTime)
  public createdAt!: Date;
}
