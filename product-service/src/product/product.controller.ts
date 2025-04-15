import { Controller, Post, Get, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { ResponseDto } from '../common/dto/response.dto'; // Import ResponseDto

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Create a product (tenant-scoped)
  @Post('create')
  async create(@Body() createProductDto: Partial<Product>): Promise<ResponseDto<Product>> {
    const response = await this.productService.createProduct(createProductDto);
    return response; // Return the structured response from the service
  }

  // Fetch all products for a tenant
  @Get('fetchAll')
  async findAll(): Promise<ResponseDto<Product[]>> {
    const response = await this.productService.findAllProducts();
    return response; // Return the structured response from the service
  }
}
