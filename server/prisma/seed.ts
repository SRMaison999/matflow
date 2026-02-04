import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Organization
  const organization = await prisma.organization.create({
    data: {
      name: 'MatFlow Demo',
      code: 'DEMO',
      settings: {
        defaultCurrency: 'CHF',
        timezone: 'Europe/Zurich',
        languages: ['fr', 'de', 'en'],
      },
    },
  });
  console.log('✓ Organization created');

  // Create Branches
  const mainBranch = await prisma.branch.create({
    data: {
      organizationId: organization.id,
      name: 'Genève',
      code: 'GVA',
      isMain: true,
      address: {
        street: 'Rue du Rhône 100',
        city: 'Genève',
        postalCode: '1204',
        country: 'Suisse',
      },
    },
  });

  const secondBranch = await prisma.branch.create({
    data: {
      organizationId: organization.id,
      name: 'Zurich',
      code: 'ZRH',
      isMain: false,
      address: {
        street: 'Bahnhofstrasse 50',
        city: 'Zurich',
        postalCode: '8001',
        country: 'Suisse',
      },
    },
  });
  console.log('✓ Branches created');

  // Create Admin User
  const passwordHash = await argon2.hash('Admin123!');

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@matflow.local',
      passwordHash,
      firstName: 'Admin',
      lastName: 'MatFlow',
      role: 'SUPER_ADMIN',
      branchId: mainBranch.id,
      isActive: true,
    },
  });
  console.log('✓ Admin user created');

  // Create additional users
  await prisma.user.createMany({
    data: [
      {
        email: 'manager@matflow.local',
        passwordHash,
        firstName: 'Marie',
        lastName: 'Dupont',
        role: 'PROJECT_MANAGER',
        branchId: mainBranch.id,
        isActive: true,
      },
      {
        email: 'warehouse@matflow.local',
        passwordHash,
        firstName: 'Jean',
        lastName: 'Martin',
        role: 'WAREHOUSE_MANAGER',
        branchId: mainBranch.id,
        isActive: true,
      },
      {
        email: 'tech@matflow.local',
        passwordHash,
        firstName: 'Pierre',
        lastName: 'Bernard',
        role: 'TECHNICIAN',
        branchId: mainBranch.id,
        isActive: true,
      },
    ],
  });
  console.log('✓ Additional users created');

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Éclairage',
        code: 'LIGHT',
        description: 'Équipements d\'éclairage',
        branchId: mainBranch.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Son',
        code: 'SOUND',
        description: 'Équipements audio',
        branchId: mainBranch.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Vidéo',
        code: 'VIDEO',
        description: 'Équipements vidéo',
        branchId: mainBranch.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Structure',
        code: 'STRUCT',
        description: 'Structures et supports',
        branchId: mainBranch.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Câblage',
        code: 'CABLE',
        description: 'Câbles et connectique',
        branchId: mainBranch.id,
      },
    }),
  ]);
  console.log('✓ Categories created');

  // Create Locations
  const warehouse = await prisma.location.create({
    data: {
      name: 'Entrepôt Principal',
      code: 'WH-MAIN',
      type: 'WAREHOUSE',
      branchId: mainBranch.id,
    },
  });

  const zones = await Promise.all([
    prisma.location.create({
      data: {
        name: 'Zone A - Éclairage',
        code: 'ZONE-A',
        type: 'ZONE',
        branchId: mainBranch.id,
        parentId: warehouse.id,
      },
    }),
    prisma.location.create({
      data: {
        name: 'Zone B - Son',
        code: 'ZONE-B',
        type: 'ZONE',
        branchId: mainBranch.id,
        parentId: warehouse.id,
      },
    }),
    prisma.location.create({
      data: {
        name: 'Zone C - Vidéo',
        code: 'ZONE-C',
        type: 'ZONE',
        branchId: mainBranch.id,
        parentId: warehouse.id,
      },
    }),
  ]);
  console.log('✓ Locations created');

  // Create Articles
  const articles = await Promise.all([
    // Lighting
    prisma.article.create({
      data: {
        code: 'LIGHT-001',
        barcode: '7610000000001',
        serialNumber: 'SN-LIGHT-001',
        name: 'PAR LED RGBW 18x10W',
        description: 'Projecteur PAR LED professionnel',
        type: 'SERIALIZED',
        status: 'AVAILABLE',
        condition: 'EXCELLENT',
        categoryId: categories[0].id,
        branchId: mainBranch.id,
        locationId: zones[0].id,
        purchasePrice: 450,
        rentalPriceDaily: 25,
        weight: 4.5,
        dimensions: { length: 30, width: 30, height: 35 },
      },
    }),
    prisma.article.create({
      data: {
        code: 'LIGHT-002',
        barcode: '7610000000002',
        serialNumber: 'SN-LIGHT-002',
        name: 'Lyre Spot LED 150W',
        description: 'Lyre motorisée spot LED',
        type: 'SERIALIZED',
        status: 'AVAILABLE',
        condition: 'GOOD',
        categoryId: categories[0].id,
        branchId: mainBranch.id,
        locationId: zones[0].id,
        purchasePrice: 1200,
        rentalPriceDaily: 75,
        weight: 12,
        dimensions: { length: 40, width: 35, height: 55 },
      },
    }),
    // Sound
    prisma.article.create({
      data: {
        code: 'SOUND-001',
        barcode: '7610000000003',
        serialNumber: 'SN-SOUND-001',
        name: 'Enceinte Active 15" 1000W',
        description: 'Enceinte active bi-amplifiée',
        type: 'SERIALIZED',
        status: 'AVAILABLE',
        condition: 'EXCELLENT',
        categoryId: categories[1].id,
        branchId: mainBranch.id,
        locationId: zones[1].id,
        purchasePrice: 800,
        rentalPriceDaily: 50,
        weight: 25,
        dimensions: { length: 45, width: 42, height: 70 },
      },
    }),
    prisma.article.create({
      data: {
        code: 'SOUND-002',
        barcode: '7610000000004',
        serialNumber: 'SN-SOUND-002',
        name: 'Console numérique 32 canaux',
        description: 'Console de mixage numérique',
        type: 'SERIALIZED',
        status: 'AVAILABLE',
        condition: 'EXCELLENT',
        categoryId: categories[1].id,
        branchId: mainBranch.id,
        locationId: zones[1].id,
        purchasePrice: 3500,
        rentalPriceDaily: 200,
        weight: 15,
        dimensions: { length: 80, width: 50, height: 25 },
      },
    }),
    // Video
    prisma.article.create({
      data: {
        code: 'VIDEO-001',
        barcode: '7610000000005',
        serialNumber: 'SN-VIDEO-001',
        name: 'Vidéoprojecteur 10000 lumens',
        description: 'Vidéoprojecteur événementiel',
        type: 'SERIALIZED',
        status: 'AVAILABLE',
        condition: 'GOOD',
        categoryId: categories[2].id,
        branchId: mainBranch.id,
        locationId: zones[2].id,
        purchasePrice: 8000,
        rentalPriceDaily: 400,
        weight: 20,
        dimensions: { length: 50, width: 40, height: 20 },
      },
    }),
    // Cables (batch type)
    prisma.article.create({
      data: {
        code: 'CABLE-XLR-10M',
        barcode: '7610000000010',
        name: 'Câble XLR 10m',
        description: 'Câble microphone XLR mâle/femelle 10m',
        type: 'BATCH',
        status: 'AVAILABLE',
        condition: 'GOOD',
        categoryId: categories[4].id,
        branchId: mainBranch.id,
        locationId: zones[1].id,
        purchasePrice: 25,
        rentalPriceDaily: 2,
        weight: 0.5,
      },
    }),
  ]);
  console.log('✓ Articles created');

  // Create a demo Client
  const client = await prisma.client.create({
    data: {
      name: 'Festival de Montreux',
      type: 'COMPANY',
      email: 'contact@montreuxfestival.ch',
      phone: '+41 21 966 82 82',
      address: {
        street: 'Rue du Théâtre 5',
        city: 'Montreux',
        postalCode: '1820',
        country: 'Suisse',
      },
      branchId: mainBranch.id,
      creditLimit: 100000,
      paymentTerms: 30,
    },
  });
  console.log('✓ Demo client created');

  // Create a demo Project
  const project = await prisma.project.create({
    data: {
      number: 'PRJ-2024-001',
      name: 'Concert Été 2024',
      description: 'Concert en plein air - scène principale',
      clientId: client.id,
      branchId: mainBranch.id,
      managerId: adminUser.id,
      status: 'ACTIVE',
      startDate: new Date('2024-07-15'),
      endDate: new Date('2024-07-17'),
      venue: {
        name: 'Place du Marché',
        address: 'Place du Marché, 1820 Montreux',
      },
      budget: 25000,
    },
  });
  console.log('✓ Demo project created');

  console.log('');
  console.log('✅ Database seeding complete!');
  console.log('');
  console.log('Default credentials:');
  console.log('  Admin: admin@matflow.local / Admin123!');
  console.log('  Manager: manager@matflow.local / Admin123!');
  console.log('  Warehouse: warehouse@matflow.local / Admin123!');
  console.log('  Technician: tech@matflow.local / Admin123!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
