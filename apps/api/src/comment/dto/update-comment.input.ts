// 📁 update-comment.input.ts - FIXED: Proper validation
import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsString, MinLength, IsOptional } from 'class-validator';

@InputType()
export class UpdateCommentInput {
  @Field(() => Int)
  @IsNumber()
  id: number;

  @Field({ nullable: true }) // ✅ FIXED: Make content optional for partial updates
  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'Content must be at least 5 characters long' })
  content?: string;

  @Field(() => Int, { nullable: true }) // ✅ ADDED: Optional postId for flexibility
  @IsOptional()
  @IsNumber()
  postId?: number;
}
