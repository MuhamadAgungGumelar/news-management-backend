import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../../modules/admins/entities/admin.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DatabaseSeeder implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async onModuleInit() {
    await this.seedSuperAdmin();
  }

  private async seedSuperAdmin() {
    try {
      const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'superadmin@news.com';
      const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin123!';
      const superAdminName = process.env.SUPER_ADMIN_NAME || 'Super Administrator';

      // Check if super admin already exists
      const existingSuperAdmin = await this.adminRepository.findOne({
        where: { email: superAdminEmail },
      });

      if (existingSuperAdmin) {
        this.logger.log(`Super admin already exists: ${superAdminEmail}`);
        return;
      }

      // Hash password
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
      const hashedPassword = await bcrypt.hash(superAdminPassword, saltRounds);

      // Create super admin
      const superAdmin = this.adminRepository.create({
        email: superAdminEmail,
        password: hashedPassword,
        name: superAdminName,
        role: 'super_admin',
        isActive: true,
      });

      await this.adminRepository.save(superAdmin);

      this.logger.log(`✅ Super admin created successfully!`);
      this.logger.log(`   Email: ${superAdminEmail}`);
      this.logger.log(`   Password: ${superAdminPassword}`);
      this.logger.log(`   ⚠️  Please change the password after first login!`);
    } catch (error) {
      this.logger.error(`Failed to seed super admin: ${error.message}`);
    }
  }
}
