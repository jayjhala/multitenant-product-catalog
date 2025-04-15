import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantService } from '../auth/tenant.service';
import { ResponseDto } from '../common/dto/response.dto'; // Import ResponseDto

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private tenantService: TenantService,
  ) {}

  // Create a new product
  async createProduct(createProductDto: Partial<Product>): Promise<ResponseDto<Product>> {
    const tenantId = this.tenantService.getTenantId();
    if (!tenantId) {
      return {
        success: false,
        message: 'Tenant ID is missing or invalid',
        error: 'Tenant ID is missing or invalid',
      };
    }

    const { name, price } = createProductDto;

    if (!name || !price) {
      return {
        success: false,
        message: 'Product name and price are required',
        error: 'Product name and price are required',
      };
    }

    try {
      const product = this.productRepository.create({
        ...createProductDto,
        tenant_id: tenantId,
      });

      const savedProduct = await this.productRepository.save(product);
      return {
        success: true,
        message: 'Product created successfully',
        data: savedProduct,
      };
    } catch (error) {
      console.error('Error while saving product:', error);
      return {
        success: false,
        message: 'Failed to create product',
        error: 'Internal server error',
      };
    }
  }

  // Fetch all products for the tenant
  async findAllProducts(): Promise<ResponseDto<Product[]>> {
    const tenantId = this.tenantService.getTenantId();
    if (!tenantId) {
      return {
        success: false,
        message: 'Tenant ID is missing or invalid',
        error: 'Tenant ID is missing or invalid',
      };
    }

    try {
      const products = await this.productRepository.find({
        where: { tenant_id: tenantId },
      });

      if (!products.length) {
        return {
          success: false,
          message: 'No products found for this tenant',
          error: 'No products found',
        };
      }

      return {
        success: true,
        message: 'Products fetched successfully',
        data: products,
      };
    } catch (error) {
      console.error('Error while fetching products:', error);
      return {
        success: false,
        message: 'Failed to fetch products',
        error: 'Internal server error',
      };
    }
  }
}
