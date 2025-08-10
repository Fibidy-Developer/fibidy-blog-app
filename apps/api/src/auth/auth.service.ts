import {
  Injectable,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { SignInInput } from './dto/signin.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { verify, hash } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { User } from '@prisma/client';
import { CreateUserInput } from 'src/user/dto/create-user.input';
import { EmailService } from 'src/email/email.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validateLocalUser({ email, password }: SignInInput): Promise<User> {
    try {
      this.logger.log(`Validating local user: ${email}`);

      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        this.logger.warn(`User not found: ${email}`);
        throw new UnauthorizedException('User Not Found');
      }

      const passwordMatched = await verify(user.password, password);

      if (!passwordMatched) {
        this.logger.warn(`Invalid credentials for user: ${email}`);
        throw new UnauthorizedException('Invalid Credentials!');
      }

      this.logger.log(`User validated successfully: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`Error validating local user: ${error.message}`);
      throw error;
    }
  }

  async generateToken(userId: number): Promise<{ accessToken: string }> {
    try {
      const payload: AuthJwtPayload = { sub: userId };
      const accessToken = await this.jwtService.signAsync(payload);
      this.logger.log(`Token generated for user: ${userId}`);
      return { accessToken };
    } catch (error) {
      this.logger.error(
        `Error generating token for user ${userId}: ${error.message}`,
      );
      throw error;
    }
  }

  async login(user: User) {
    try {
      this.logger.log(`Login process started for user: ${user.id}`);

      const { accessToken } = await this.generateToken(user.id);

      const loginData = {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        accessToken,
      };

      this.logger.log(`Login successful for user: ${user.id}`);
      return loginData;
    } catch (error) {
      this.logger.error(`Login failed for user ${user.id}: ${error.message}`);
      throw error;
    }
  }

  async validateJwtUser(userId: number) {
    try {
      this.logger.log(`Validating JWT user: ${userId}`);

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        this.logger.warn(`JWT validation failed: User not found ${userId}`);
        throw new UnauthorizedException('User not found!');
      }

      const currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      this.logger.log(`JWT user validated successfully: ${userId}`);
      return currentUser;
    } catch (error) {
      this.logger.error(
        `Error validating JWT user ${userId}: ${error.message}`,
      );
      throw error;
    }
  }

  async validateGoogleUser(googleUser: CreateUserInput) {
    try {
      this.logger.log(`Validating Google user: ${googleUser.email}`);

      const existingUser = await this.prisma.user.findUnique({
        where: { email: googleUser.email },
      });

      if (existingUser) {
        this.logger.log(`Existing Google user found: ${existingUser.id}`);

        const authUser = { ...existingUser } as Omit<
          typeof existingUser,
          'password'
        >;
        delete (authUser as any).password;

        return authUser;
      }

      this.logger.log(`Creating new Google user: ${googleUser.email}`);
      const newUser = await this.prisma.user.create({
        data: {
          ...googleUser,
          password: '',
        },
      });

      const authUser = { ...newUser } as Omit<typeof newUser, 'password'>;
      delete (authUser as any).password;

      this.logger.log(`New Google user created: ${newUser.id}`);
      return authUser;
    } catch (error: any) {
      this.logger.error(
        `Error validating Google user ${googleUser.email}: ${error.message}`,
      );
      throw error;
    }
  }

  // New reset password methods
  async forgotPassword(email: string): Promise<boolean> {
    try {
      this.logger.log(`Forgot password request for email: ${email}`);

      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        this.logger.warn(`Forgot password: User not found ${email}`);
        // Return true for security (don't reveal if email exists)
        return true;
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Save reset token to database
      await this.prisma.user.update({
        where: { email },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      // Send reset password email
      await this.emailService.sendResetPasswordEmail(email, resetToken);

      this.logger.log(`Reset password email sent to: ${email}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Error in forgot password for ${email}: ${error.message}`,
      );
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      this.logger.log(
        `Reset password attempt with token: ${token.substring(0, 8)}...`,
      );

      if (!token || !newPassword) {
        throw new BadRequestException('Token and new password are required');
      }

      // Find user with valid reset token
      const user = await this.prisma.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExpiry: {
            gt: new Date(),
          },
        },
      });

      if (!user) {
        this.logger.warn(
          `Invalid or expired reset token: ${token.substring(0, 8)}...`,
        );
        throw new BadRequestException('Invalid or expired reset token');
      }

      // Hash new password using argon2 (same as your existing auth)
      const hashedPassword = await hash(newPassword);

      // Update user password and clear reset token
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      this.logger.log(`Password reset successful for user: ${user.id}`);
      return true;
    } catch (error) {
      this.logger.error(`Error in reset password: ${error.message}`);
      throw error;
    }
  }

  async validateResetToken(token: string): Promise<boolean> {
    try {
      this.logger.log(`Validating reset token: ${token.substring(0, 8)}...`);

      const user = await this.prisma.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExpiry: {
            gt: new Date(),
          },
        },
      });

      const isValid = !!user;
      this.logger.log(`Reset token validation result: ${isValid}`);

      return isValid;
    } catch (error) {
      this.logger.error(`Error validating reset token: ${error.message}`);
      return false;
    }
  }
}
