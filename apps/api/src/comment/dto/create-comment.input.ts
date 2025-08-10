// 📁 create-comment.input.ts - Enhanced validation
import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNumber, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field(() => Int)
  @IsNumber()
  postId: number;

  @Field()
  @IsString()
  @MinLength(5, { message: 'Content must be at least 5 characters long' }) // ✅ ADDED: Validation
  content: string;
}
