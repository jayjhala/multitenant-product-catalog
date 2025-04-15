import * as dotenv from 'dotenv';
dotenv.config();
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filter/http-exception.filter';
import { TenantService } from './auth/tenant.service';
import { TenantMiddleware } from './auth/tenant.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  
  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());
  
  app.use(cookieParser()); // <-- THIS is important
  
  // Manual middleware registration to ensure context stays within async local storage
  const tenantService = app.get(TenantService);
  app.use((req, res, next) => {
    const middleware = new TenantMiddleware(tenantService);
    middleware.use(req, res, next);
  });

  app.enableCors({
    origin: process.env.FRONTEND_URL, // Frontend origin
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3002, '0.0.0.0');
}
bootstrap();
