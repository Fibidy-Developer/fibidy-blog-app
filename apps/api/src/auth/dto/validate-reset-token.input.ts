// src/auth/dto/validate-reset-token.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class ValidateResetTokenInput {
  @Field(() => String, { description: 'Reset token to validate' })
  @IsString({ message: 'Token must be a string' })
  @IsNotEmpty({ message: 'Reset token is required' })
  token: string;
}
