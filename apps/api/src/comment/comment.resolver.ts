// 📁 comment.resolver.ts - FIXED: Better error handling and logging
import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { CommentEntity } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { DEFAULT_PAGE_SIZE } from 'src/constants';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Resolver(() => CommentEntity)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Query(() => [CommentEntity])
  getPostComments(
    @Args('postId', { type: () => Int }) postId: number, // ✅ FIXED: Removed ! for flexibility
    @Args('take', {
      type: () => Int,
      nullable: true,
      defaultValue: DEFAULT_PAGE_SIZE,
    })
    take: number,
    @Args('skip', {
      type: () => Int,
      nullable: true,
      defaultValue: 0,
    })
    skip: number,
  ) {
    return this.commentService.findOneByPost({ postId, take, skip });
  }

  @Query(() => Int)
  postCommentCount(@Args('postId', { type: () => Int }) postId: number) {
    // ✅ FIXED: Removed !
    return this.commentService.count(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CommentEntity)
  createComment(
    @Context() context,
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ) {
    const authorId = context.req.user.id;
    return this.commentService.create(createCommentInput, authorId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CommentEntity)
  async updateComment(
    @Context() context,
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
  ) {
    console.log('🔄 Update comment resolver called:', { updateCommentInput });
    const userId = context.req.user.id;
    console.log('👤 User ID from context:', userId);

    try {
      const result = await this.commentService.update(
        updateCommentInput,
        userId,
      );
      console.log('✅ Update successful in resolver:', result);
      return result;
    } catch (error) {
      console.error('❌ Update failed in resolver:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  deleteComment(
    @Context() context,
    @Args('commentId', { type: () => Int }) commentId: number, // ✅ FIXED: Removed !
  ) {
    const userId = context.req.user.id;
    return this.commentService.delete(commentId, userId);
  }
}
