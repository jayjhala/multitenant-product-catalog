import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express'; // Import the Response type

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  
    return res.status(200).json({ message: 'Logout successful' });
  }
  

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    // Call the login service to authenticate the user and get a token
    const token = await this.authService.login(dto);

    // Set the token as an HTTP-only cookie in the response
    res.cookie('token', token, {
      httpOnly: true, // Prevents JavaScript access to the cookie
      secure: process.env.NODE_ENV === 'production', // Secure in production (use HTTPS)
      sameSite: 'lax', // Helps prevent CSRF attacks
      path: '/', // Available for the entire app
    });

    // Respond with a success message or the token if needed
    return res.send({ message: 'Login successful', accessToken: token });
  }
}
