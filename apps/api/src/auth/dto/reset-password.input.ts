// src/auth/dto/reset-password.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsString, MinLength, IsNotEmpty } from 'class-validator';

@InputType()
export class ResetPasswordInput {
  @Field(() => String, { description: 'Password reset token' })
  @IsString({ message: 'Token must be a string' })
  @IsNotEmpty({ message: 'Reset token is required' })
  token: string;

  @Field(() => String, { description: 'New password (min 6 characters)' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsNotEmpty({ message: 'New password is required' })
  newPassword: string;
}
