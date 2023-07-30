import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Message, Conversation } from '@prisma/client';
import { ConversationArgs } from './dto/conversation.args';
import { MessageArgs } from './dto/message.args';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getAllConversationList(): Promise<Conversation[]> {
    return this.prisma.conversation.findMany();
  }

  async getConversationById(id: string): Promise<Conversation> {
    console.log(`calling conversationById`, { id: id });
    return this.prisma.conversation.findUnique({
      where: { id },
    });
  }

  async createConversation(conversationArgs: ConversationArgs) {
    console.log(`calling conversationCreate`, { ...conversationArgs });

    return this.prisma.conversation.create({
      data: {
        creatorId: conversationArgs.creatorId,
        name: conversationArgs.name,
      },
    });
  }
  async createMessage(data: MessageArgs): Promise<Message> {
    const { content, conversationId, senderId } = data;
    console.log(`calling messageCreate`, { content, conversationId, senderId });

    return this.prisma.message.create({
      data: {
        content,
        conversationId,
        senderId,
      },
    });
  }

  async getMessagesByConversationId(id: string): Promise<Message[]> {
    console.log(`calling getMessagesByConversationId`, { id: id });
    return this.prisma.message.findMany({
      where: {
        conversationId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getLastMessagesByConversationId(id: string): Promise<Message[]> {
    console.log(`calling getLastMessagesByConversationId`, { id: id });
    return this.prisma.message.findMany({
      where: {
        conversationId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });
  }

  validateConversation(conversationId: string) {
    return !!this.prisma.conversation.findFirst({
      where: { id: conversationId },
    });
  }
}
