import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Tenant) private tenantRepo: Repository<Tenant>,
    private jwtService: JwtService,
    @Inject('RABBITMQ_SERVICE') private client: ClientProxy,
  ) {}

  async register(dto: RegisterDto) {
    const existingTenant = await this.tenantRepo.findOne({ where: { name: dto.tenantName } });
    if (existingTenant) throw new Error('Tenant already exists');

    const tenant = this.tenantRepo.create({ name: dto.tenantName });
    await this.tenantRepo.save(tenant);

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      email: dto.email,
      password: hashedPassword,
      tenant,
    });
    await this.userRepo.save(user);

    // Emit event
    this.client.emit('tenant.created', {
      tenantId: tenant.id,
      name: tenant.name,
    });

    return this.generateToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      relations: ['tenant'],
    });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  generateToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenant.id,
    };

    return this.jwtService.sign(payload);  // Directly return the token
  }
}

