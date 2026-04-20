import { Controller, Get, Req, UseGuards, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  googleAuth() {
    // Passport handles the redirect to Google
  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  googleAuthCallback(@Req() req: any, @Res() res: Response) {
    const token = this.authService.generateToken(req.user);
    const clientUrl = this.configService.get<string>('CLIENT_URL', 'http://localhost:5173');
    // Redirect to frontend with token in query param
    res.redirect(`${clientUrl}/auth/callback?token=${token}`);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: any) {
    const user = req.user;
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };
  }
}
