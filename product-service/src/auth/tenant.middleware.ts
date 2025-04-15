// src/auth/tenant.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { TenantService } from './tenant.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly tenantService: TenantService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // ✅ Extract token from cookies (HTTP-only cookie)
    const token = req.cookies?.token;
    const secret = process.env.JWT_SECRET;

    if (!token) {
      console.warn('No JWT token found in cookies.');
      return next(); // Proceed without tenant context
    }

    if (!secret) {
      console.error('JWT_SECRET is not defined in environment variables.');
      return next();
    }

    try {
      // ✅ Verify and decode the token
      const decoded: any = jwt.verify(token, secret);

      if (!decoded?.tenantId) {
        console.warn('JWT does not contain tenantId.');
        return next();
      }

      // Optional: attach tenantId to request
      (req as any).tenantId = decoded.tenantId;

      // ✅ Run with tenant context
      this.tenantService.runWithTenant(decoded.tenantId, () => {
        next(); // Continue to the next middleware/handler
      });
    } catch (err) {
      console.error('Failed to verify JWT:', err.message);
      return next(); // Proceed without tenant context
    }
  }
}
