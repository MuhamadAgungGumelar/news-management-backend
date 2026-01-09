import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AdminsRepository } from './admins.repository';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { QueryAdminDto } from './dto/query-admin.dto';

@Injectable()
export class AdminsService {
  constructor(private adminsRepository: AdminsRepository) {}

  async findAll(queryDto: QueryAdminDto) {
    const { data, total } = await this.adminsRepository.findAll(queryDto);
    const { page = 1, limit = 10 } = queryDto;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const admin = await this.adminsRepository.findOne(id);

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin;
  }

  async create(createAdminDto: CreateAdminDto) {
    const existingAdmin = await this.adminsRepository.findByEmail(
      createAdminDto.email,
    );

    if (existingAdmin) {
      throw new ConflictException('Admin with this email already exists');
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
    const hashedPassword = await bcrypt.hash(
      createAdminDto.password,
      saltRounds,
    );

    const adminData = {
      ...createAdminDto,
      password: hashedPassword,
    };

    try {
      const admin = await this.adminsRepository.create(adminData);
      return admin;
    } catch (error) {
      if (error.message === 'DUPLICATE_EMAIL') {
        throw new ConflictException('Admin with this email already exists');
      }
      throw error;
    }
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    const admin = await this.adminsRepository.findOne(id);

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const updatedAdmin = await this.adminsRepository.update(id, updateAdminDto);
    return updatedAdmin;
  }

  async delete(id: string, currentUserId: string) {
    if (id === currentUserId) {
      throw new BadRequestException('Cannot delete your own account');
    }

    const admin = await this.adminsRepository.findOne(id);

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    await this.adminsRepository.delete(id);

    return {
      message: 'Admin deleted successfully',
    };
  }
}
