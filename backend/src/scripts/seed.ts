import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { AdminModel } from '../models/admin.model';

config();

/**
 * Generate a secure random password
 * @param length - Length of the password (default: 16)
 * @returns Secure random password
 */
function generateSecurePassword(length: number = 16): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  const randomBytes = crypto.randomBytes(length);
  let password = '';

  for (let i = 0; i < length; i++) {
    password += charset[randomBytes[i] % charset.length];
  }

  return password;
}

/**
 * Seed admin users
 */
async function seedAdmins() {
  try {
    // Connect to MongoDB
    const DATABASE_URI = process.env.DATABASE_URI;
    if (!DATABASE_URI) {
      throw new Error('DATABASE_URI environment variable is not set');
    }

    await mongoose.connect(DATABASE_URI, {
      serverSelectionTimeoutMS: 10_000,
      socketTimeoutMS: 45_000,
    } as any);

    console.log('✅ Connected to MongoDB');

    // Check if admins already exist
    const existingAdmins = await AdminModel.find();
    if (existingAdmins.length > 0) {
      console.log('\n⚠️  Warning: Admin users already exist in the database');
      console.log(`Found ${existingAdmins.length} existing admin(s):`);
      existingAdmins.forEach((admin, index) => {
        console.log(`  ${index + 1}. ${admin.email}`);
      });
      console.log('\nSkipping seed to prevent duplicates. Delete existing admins first if you want to reseed.');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Generate secure passwords
    const adminPassword = generateSecurePassword(16);
    const superAdminPassword = generateSecurePassword(16);

    // Hash passwords
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
    const hashedSuperAdminPassword = await bcrypt.hash(superAdminPassword, 10);

    // Create admin users
    const admin = await AdminModel.create({
      email: 'admin@nextmodelsnepal.com',
      password: hashedAdminPassword,
    });

    const superAdmin = await AdminModel.create({
      email: 'superadmin@nextmodelsnepal.com',
      password: hashedSuperAdminPassword,
    });

    console.log('\n✅ Successfully seeded admin users!\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('                    ADMIN CREDENTIALS                      ');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n📧 Admin User:');
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('\n📧 Super Admin User:');
    console.log(`   Email:    ${superAdmin.email}`);
    console.log(`   Password: ${superAdminPassword}`);
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('⚠️  IMPORTANT: Save these credentials securely!');
    console.log('   These passwords will not be shown again.');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Close database connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the seed function
seedAdmins();
