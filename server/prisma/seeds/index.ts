// =====================================================
// MatFlow - Database Seeder
// =====================================================

import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create organization
  const organization = await prisma.organization.upsert({
    where: { code: 'MATFLOW' },
    update: {},
    create: {
      code: 'MATFLOW',
      name: 'MatFlow Demo',
      legalName: 'MatFlow SA',
      address: {
        street: 'Rue de la Gare 1',
        city: 'Lausanne',
        postalCode: '1003',
        country: 'Switzerland',
        countryCode: 'CH',
      },
      contact: {
        email: 'info@matflow.local',
        phone: '+41 21 123 45 67',
      },
      defaultCurrency: 'CHF',
      defaultLanguage: 'fr',
      timezone: 'Europe/Zurich',
      enabledModules: [
        'articles',
        'stock',
        'reservations',
        'projects',
        'kits',
        'cases',
        'operations',
        'maintenance',
        'billing',
        'notifications',
        'documents',
      ],
      settings: {
        articleCodePattern: 'ART{NUMBER:6}',
        reservationCodePattern: 'RES{YEAR}{NUMBER:5}',
        projectCodePattern: 'PRJ{YEAR}{NUMBER:4}',
        invoiceCodePattern: 'INV{YEAR}{NUMBER:5}',
        quoteCodePattern: 'DEV{YEAR}{NUMBER:5}',
        autoGenerateCodes: true,
        defaultPaymentTermsDays: 30,
        defaultTaxRate: 7.7,
        defaultPricingType: 'DAILY',
        allowNegativeStock: false,
        requireReturnVerification: true,
        requirePickingVerification: true,
        allowPartialReturns: true,
        notificationDefaults: {
          lowStockThreshold: 5,
          maintenanceReminderDays: 7,
          reservationReminderDays: 1,
          invoiceReminderDays: 7,
        },
        enabledIntegrations: [],
        dataRetentionYears: 10,
        requireConsentForMarketing: true,
      },
    },
  });

  console.log(`✅ Organization created: ${organization.name}`);

  // Create main branch
  const mainBranch = await prisma.branch.upsert({
    where: { code: 'HQ' },
    update: {},
    create: {
      code: 'HQ',
      name: 'Siège principal',
      type: 'HEADQUARTERS',
      organizationId: organization.id,
      address: {
        street: 'Rue de la Gare 1',
        city: 'Lausanne',
        postalCode: '1003',
        country: 'Switzerland',
        countryCode: 'CH',
      },
      contact: {
        email: 'hq@matflow.local',
        phone: '+41 21 123 45 67',
      },
      currency: 'CHF',
      language: 'fr',
      timezone: 'Europe/Zurich',
      isActive: true,
      isHeadquarters: true,
      hasLocalStock: true,
      canAccessCentralStock: true,
    },
  });

  console.log(`✅ Branch created: ${mainBranch.name}`);

  // Create admin user
  const passwordHash = await argon2.hash('admin123');

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@matflow.local' },
    update: {},
    create: {
      email: 'admin@matflow.local',
      username: 'admin',
      passwordHash,
      firstName: 'Admin',
      lastName: 'MatFlow',
      displayName: 'Admin MatFlow',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      branchId: mainBranch.id,
      branchIds: [mainBranch.id],
      language: 'fr',
      timezone: 'Europe/Zurich',
      emailVerifiedAt: new Date(),
      notificationPrefs: {
        channels: ['IN_APP', 'EMAIL'],
        categories: {
          reservation: true,
          project: true,
          stock: true,
          maintenance: true,
          billing: true,
          system: true,
        },
      },
      permissions: ['*'],
    },
  });

  console.log(`✅ Admin user created: ${adminUser.email}`);

  // Create categories
  const categories = [
    { name: 'Audio', slug: 'audio', icon: 'speaker', color: '#3B82F6' },
    { name: 'Vidéo', slug: 'video', icon: 'video', color: '#10B981' },
    { name: 'Éclairage', slug: 'eclairage', icon: 'lightbulb', color: '#F59E0B' },
    { name: 'Structure', slug: 'structure', icon: 'grid', color: '#6366F1' },
    { name: 'Électricité', slug: 'electricite', icon: 'zap', color: '#EF4444' },
    { name: 'Accessoires', slug: 'accessoires', icon: 'package', color: '#8B5CF6' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        color: cat.color,
        path: cat.slug,
        depth: 0,
        isActive: true,
        customAttributes: [],
      },
    });
  }

  console.log(`✅ ${categories.length} categories created`);

  // Create locations
  const warehouseLocation = await prisma.location.upsert({
    where: { code: 'WH-MAIN' },
    update: {},
    create: {
      code: 'WH-MAIN',
      name: 'Entrepôt principal',
      type: 'WAREHOUSE',
      branchId: mainBranch.id,
      path: 'WH-MAIN',
      depth: 0,
      isActive: true,
    },
  });

  const zones = ['A', 'B', 'C'];
  for (const zone of zones) {
    await prisma.location.upsert({
      where: { code: `WH-MAIN-${zone}` },
      update: {},
      create: {
        code: `WH-MAIN-${zone}`,
        name: `Zone ${zone}`,
        type: 'ZONE',
        branchId: mainBranch.id,
        parentId: warehouseLocation.id,
        path: `WH-MAIN/${zone}`,
        depth: 1,
        isActive: true,
      },
    });
  }

  console.log(`✅ Locations created`);

  console.log('\n🎉 Database seed completed successfully!\n');
  console.log('📧 Admin login: admin@matflow.local');
  console.log('🔑 Password: admin123\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
