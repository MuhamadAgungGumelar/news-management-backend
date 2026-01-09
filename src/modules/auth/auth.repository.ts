import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../admins/entities/admin.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async findAdminByEmail(email: string): Promise<Admin | null> {
    return await this.adminRepository.findOne({ where: { email } });
  }

  async findAdminById(id: string): Promise<Admin | null> {
    return await this.adminRepository.findOne({ where: { id } });
  }

  async updateLastLogin(adminId: string): Promise<void> {
    await this.adminRepository.update(adminId, {
      lastLoginAt: new Date(),
    });
  }

  async updatePassword(adminId: string, hashedPassword: string): Promise<void> {
    await this.adminRepository.update(adminId, {
      password: hashedPassword,
    });
  }
}
