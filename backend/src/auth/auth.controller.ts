import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() req) {
    // Validate user first? Usually LocalGuard does this, but for simplicity we can do manual check if we want, 
    // or rely on AuthService to validate.
    // If using LocalStrategy, we would use @UseGuards(LocalAuthGuard).
    // Let's do a simple manual validation here or assume 'req' contains {username, password}
    
    const user = await this.authService.validateUser(req.username, req.password);
    if (!user) {
        throw new Error('Invalid credentials'); // Should be UnauthorizedException
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() createUserDto: any) {
    return this.authService.register(createUserDto);
  }
}
