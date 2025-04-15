// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // A method to validate JWT token
  validateToken(token: string): any {
    return this.jwtService.verify(token);
  }
}
