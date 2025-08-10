import {
  Controller,
  Get,
  Request,
  Res,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {
    this.logger.log('Google login initiated');
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Request() req, @Res() res: Response) {
    try {
      this.logger.log(
        `Google callback received for user: ${req.user?.email || 'unknown'}`,
      );

      if (!req.user) {
        this.logger.error('No user found in Google callback');
        return res.redirect('http://localhost:3000?error=auth_failed');
      }

      const userData = await this.authService.login(req.user);
      this.logger.log(`User logged in successfully: ${userData.id}`);

      res.redirect(
        `http://localhost:3000/api/auth/google/callback?userId=${userData.id}&name=${encodeURIComponent(userData.name)}&avatar=${encodeURIComponent(userData.avatar || '')}&accessToken=${userData.accessToken}`,
      );
    } catch (error) {
      this.logger.error('Error in Google callback:', error.message);
      res.redirect('http://localhost:3000?error=server_error');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify-token')
  verify(@Request() req) {
    this.logger.log(
      `Token verification for user: ${req.user?.id || 'unknown'}`,
    );

    if (!req.user) {
      this.logger.warn('JWT verification failed: No user in request');
      return { success: false, message: 'User not found' };
    }

    return {
      success: true,
      user: req.user,
      message: 'Token verified successfully',
    };
  }
}
