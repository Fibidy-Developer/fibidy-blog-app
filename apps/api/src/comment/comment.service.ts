// 📁 comment.service.ts - FIXED: Better error handling and validation
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { DEFAULT_PAGE_SIZE } from 'src/constants';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneByPost({
    postId,
    take,
    skip,
  }: {
    postId: number;
    take?: number;
    skip?: number;
  }) {
    return await this.prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: skip ?? 0,
      take: take ?? DEFAULT_PAGE_SIZE,
    });
  }

  async count(postId: number) {
    return await this.prisma.comment.count({
      where: {
        postId,
      },
    });
  }

  async create(createCommentInput: CreateCommentInput, authorId: number) {
    return await this.prisma.comment.create({
      data: {
        content: createCommentInput.content,
        post: {
          connect: {
            id: createCommentInput.postId,
          },
        },
        author: {
          connect: {
            id: authorId,
          },
        },
      },
      include: {
        author: true,
      },
    });
  }

  async update(updateCommentInput: UpdateCommentInput, userId: number) {
    // ✅ FIXED: Better validation and error handling
    console.log('🔄 Update comment service called:', {
      updateCommentInput,
      userId,
    });

    // Find comment with proper error handling
    const comment = await this.prisma.comment.findFirst({
      where: {
        id: updateCommentInput.id,
        authorId: userId,
      },
      include: {
        author: true,
      },
    });

    if (!comment) {
      console.log('❌ Comment not found or unauthorized:', {
        commentId: updateCommentInput.id,
        userId,
      });
      throw new NotFoundException(
        'Comment not found or you are not authorized to edit this comment',
      );
    }

    // ✅ FIXED: Only update fields that are provided
    const updateData: any = {};
    if (updateCommentInput.content !== undefined) {
      updateData.content = updateCommentInput.content;
    }

    console.log('📝 Updating comment with data:', updateData);

    const updatedComment = await this.prisma.comment.update({
      where: {
        id: updateCommentInput.id,
      },
      data: updateData,
      include: {
        author: true,
      },
    });

    console.log('✅ Comment updated successfully:', updatedComment);
    return updatedComment;
  }

  async delete(commentId: number, userId: number) {
    // ✅ FIXED: Better error handling
    const comment = await this.prisma.comment.findFirst({
      where: {
        id: commentId,
        authorId: userId,
      },
    });

    if (!comment) {
      throw new NotFoundException(
        'Comment not found or you are not authorized to delete this comment',
      );
    }

    await this.prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return true;
  }
}
