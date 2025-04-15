import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { TenantService } from '../auth/tenant.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    TenantService,
    {
      provide: 'RABBITMQ_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://rabbitmq:5672'], // Connect to RabbitMQ container
            queue: 'tenantQueue', // This should match the queue name in auth-service
            queueOptions: {
              durable: false,
            },
          },
        });
      },
    },
  ],
})
export class ProductModule {}
