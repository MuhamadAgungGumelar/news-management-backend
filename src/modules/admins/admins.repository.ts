import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Or } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { QueryAdminDto } from './dto/query-admin.dto';

@Injectable()
export class AdminsRepository {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async findAll(queryDto: QueryAdminDto) {
    const { page = 1, limit = 10, search, role, isActive } = queryDto;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const queryBuilder = this.adminRepository.createQueryBuilder('admin');

    if (search) {
      queryBuilder.where(
        '(admin.name ILIKE :search OR admin.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (role) {
      queryBuilder.andWhere('admin.role = :role', { role });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('admin.isActive = :isActive', { isActive });
    }

    const [data, total] = await queryBuilder
      .orderBy('admin.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async findOne(id: string): Promise<Admin | null> {
    return await this.adminRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return await this.adminRepository.findOne({ where: { email } });
  }

  async create(adminData: any): Promise<Admin> {
    try {
      const admin = this.adminRepository.create({
        email: adminData.email,
        password: adminData.password,
        name: adminData.name,
        role: adminData.role || 'admin',
        isActive: adminData.isActive !== undefined ? adminData.isActive : true,
      });

      return await this.adminRepository.save(admin);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new Error('DUPLICATE_EMAIL');
      }
      throw error;
    }
  }

  async update(id: string, adminData: any): Promise<Admin> {
    const admin = await this.findOne(id);
    if (!admin) {
      throw new Error('Admin not found');
    }

    if (adminData.name !== undefined) admin.name = adminData.name;
    if (adminData.role !== undefined) admin.role = adminData.role;
    if (adminData.isActive !== undefined) admin.isActive = adminData.isActive;

    return await this.adminRepository.save(admin);
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.adminRepository.delete(id);
    return { success: true };
  }
}
