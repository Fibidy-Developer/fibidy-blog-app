import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInInput } from './dto/signin.input';
import { ForgotPasswordInput } from './dto/forgot-password.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { ValidateResetTokenInput } from './dto/validate-reset-token.input';
import { AuthPayload } from './entities/auth-payload.entity';
import { Logger, BadRequestException } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);

  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async signIn(@Args('signInInput') signInInput: SignInInput) {
    try {
      this.logger.log(`Sign in attempt for email: ${signInInput.email}`);

      if (!signInInput.email || !signInInput.password) {
        throw new BadRequestException('Email and password are required');
      }

      const user = await this.authService.validateLocalUser(signInInput);
      const result = await this.authService.login(user);

      this.logger.log(`Sign in successful for user: ${user.id}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Sign in failed for email ${signInInput.email}: ${error.message}`,
      );
      throw error;
    }
  }

  @Mutation(() => Boolean, {
    description: 'Send password reset email to user',
  })
  async forgotPassword(
    @Args('forgotPasswordInput') forgotPasswordInput: ForgotPasswordInput,
  ): Promise<boolean> {
    try {
      this.logger.log(
        `Forgot password request for: ${forgotPasswordInput.email}`,
      );

      if (!forgotPasswordInput.email) {
        throw new BadRequestException('Email is required');
      }

      const result = await this.authService.forgotPassword(
        forgotPasswordInput.email,
      );

      this.logger.log(
        `Forgot password process completed for: ${forgotPasswordInput.email}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Forgot password failed for ${forgotPasswordInput.email}: ${error.message}`,
      );
      throw error;
    }
  }

  @Mutation(() => Boolean, {
    description: 'Reset user password with token',
  })
  async resetPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput,
  ): Promise<boolean> {
    try {
      const tokenPrefix = resetPasswordInput.token.substring(0, 8);
      this.logger.log(`Reset password attempt with token: ${tokenPrefix}...`);

      if (!resetPasswordInput.token || !resetPasswordInput.newPassword) {
        throw new BadRequestException('Token and new password are required');
      }

      const result = await this.authService.resetPassword(
        resetPasswordInput.token,
        resetPasswordInput.newPassword,
      );

      this.logger.log(`Reset password successful for token: ${tokenPrefix}...`);
      return result;
    } catch (error) {
      this.logger.error(`Reset password failed: ${error.message}`);
      throw error;
    }
  }

  @Query(() => Boolean, {
    description: 'Validate if reset token is still valid',
  })
  async validateResetToken(
    @Args('validateResetTokenInput')
    validateResetTokenInput: ValidateResetTokenInput,
  ): Promise<boolean> {
    try {
      const tokenPrefix = validateResetTokenInput.token.substring(0, 8);
      this.logger.log(`Validating reset token: ${tokenPrefix}...`);

      if (!validateResetTokenInput.token) {
        throw new BadRequestException('Token is required');
      }

      const isValid = await this.authService.validateResetToken(
        validateResetTokenInput.token,
      );

      this.logger.log(
        `Reset token validation result: ${isValid} for ${tokenPrefix}...`,
      );
      return isValid;
    } catch (error) {
      this.logger.error(`Token validation failed: ${error.message}`);
      throw error;
    }
  }
}
