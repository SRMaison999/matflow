// =====================================================
// MatFlow - Articles Service
// =====================================================

import { prisma } from '@/lib/prisma.js';
import { cache, cacheKeys } from '@/lib/redis.js';
import { NotFoundError, ConflictError } from '@/middleware/errorHandler.js';
import { nanoid } from 'nanoid';
import type { Article, CreateArticleInput, UpdateArticleInput, ArticleQueryInput } from '@matflow/types';

export class ArticlesService {
  async findAll(query: ArticleQueryInput, branchIds: string[]) {
    const {
      search,
      type,
      status,
      condition,
      categoryId,
      branchId,
      locationId,
      tags,
      minPrice,
      maxPrice,
      isActive,
      page = 1,
      limit = 20,
      sort,
    } = query;

    // Build where clause
    const where: Record<string, unknown> = {
      deletedAt: null,
      branchId: branchId ? branchId : { in: branchIds },
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
        { serialNumber: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type) where.type = type;
    if (status) where.status = status;
    if (condition) where.condition = condition;
    if (categoryId) where.categoryId = categoryId;
    if (locationId) where.locationId = locationId;
    if (isActive !== undefined) where.isActive = isActive;

    if (tags) {
      where.tags = { hasSome: tags.split(',') };
    }

    // Build orderBy
    let orderBy: Record<string, string> = { createdAt: 'desc' };
    if (sort) {
      const [field, order] = sort.split(':');
      if (field) {
        orderBy = { [field]: order || 'asc' };
      }
    }

    // Execute query
    const [data, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true },
          },
          location: {
            select: { id: true, name: true, path: true },
          },
        },
      }),
      prisma.article.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findById(id: string, branchIds: string[]) {
    // Try cache first
    const cached = await cache.get<Article>(cacheKeys.article(id));
    if (cached && branchIds.includes(cached.branchId)) {
      return cached;
    }

    const article = await prisma.article.findFirst({
      where: {
        id,
        branchId: { in: branchIds },
        deletedAt: null,
      },
      include: {
        category: true,
        location: true,
        case: { select: { id: true, code: true, name: true } },
        kit: { select: { id: true, code: true, name: true } },
      },
    });

    if (!article) {
      throw new NotFoundError('Article', id);
    }

    // Cache for 5 minutes
    await cache.set(cacheKeys.article(id), article, 300);

    return article;
  }

  async findByCode(code: string, branchIds: string[]) {
    const article = await prisma.article.findFirst({
      where: {
        code,
        branchId: { in: branchIds },
        deletedAt: null,
      },
      include: {
        category: true,
        location: true,
      },
    });

    if (!article) {
      throw new NotFoundError('Article', code);
    }

    return article;
  }

  async create(input: CreateArticleInput, userId: string) {
    // Generate code if not provided
    const code = input.code || await this.generateCode(input.branchId);

    // Check for duplicate code
    const existing = await prisma.article.findUnique({
      where: { code },
    });

    if (existing) {
      throw new ConflictError(`Article with code '${code}' already exists`);
    }

    // Check for duplicate barcode
    if (input.barcode) {
      const existingBarcode = await prisma.article.findFirst({
        where: { barcode: input.barcode, deletedAt: null },
      });

      if (existingBarcode) {
        throw new ConflictError(`Article with barcode '${input.barcode}' already exists`);
      }
    }

    const article = await prisma.article.create({
      data: {
        code,
        barcode: input.barcode,
        serialNumber: input.serialNumber,
        name: input.name,
        description: input.description,
        type: input.type,
        categoryId: input.categoryId,
        tags: input.tags || [],
        brand: input.brand,
        model: input.model,
        manufacturer: input.manufacturer,
        condition: input.condition || 'GOOD',
        dimensions: input.dimensions as object || undefined,
        weight: input.weight as object || undefined,
        color: input.color,
        purchasePrice: input.purchasePrice as object || undefined,
        purchaseDate: input.purchaseDate ? new Date(input.purchaseDate) : undefined,
        rentalPriceDaily: input.rentalPriceDaily as object || undefined,
        rentalPriceWeekly: input.rentalPriceWeekly as object || undefined,
        branchId: input.branchId,
        locationId: input.locationId,
        quantity: input.quantity || 1,
        unit: input.unit,
        minStock: input.minStock,
        warrantyExpiresAt: input.warrantyExpiresAt ? new Date(input.warrantyExpiresAt) : undefined,
        maintenanceIntervalDays: input.maintenanceIntervalDays,
        customAttributes: input.customAttributes || {},
        createdBy: userId,
      },
      include: {
        category: true,
        location: true,
      },
    });

    return article;
  }

  async update(id: string, input: UpdateArticleInput, branchIds: string[], userId: string) {
    // Check article exists and user has access
    const existing = await prisma.article.findFirst({
      where: {
        id,
        branchId: { in: branchIds },
        deletedAt: null,
      },
    });

    if (!existing) {
      throw new NotFoundError('Article', id);
    }

    // Check for duplicate code
    if (input.code && input.code !== existing.code) {
      const duplicate = await prisma.article.findUnique({
        where: { code: input.code },
      });

      if (duplicate) {
        throw new ConflictError(`Article with code '${input.code}' already exists`);
      }
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        ...input,
        dimensions: input.dimensions as object || undefined,
        weight: input.weight as object || undefined,
        purchasePrice: input.purchasePrice as object || undefined,
        currentValue: input.currentValue as object || undefined,
        replacementValue: input.replacementValue as object || undefined,
        insuranceValue: input.insuranceValue as object || undefined,
        rentalPriceDaily: input.rentalPriceDaily as object || undefined,
        rentalPriceWeekly: input.rentalPriceWeekly as object || undefined,
        warrantyExpiresAt: input.warrantyExpiresAt ? new Date(input.warrantyExpiresAt) : undefined,
        updatedBy: userId,
      },
      include: {
        category: true,
        location: true,
      },
    });

    // Invalidate cache
    await cache.del(cacheKeys.article(id));

    return article;
  }

  async delete(id: string, branchIds: string[], userId: string) {
    // Check article exists and user has access
    const existing = await prisma.article.findFirst({
      where: {
        id,
        branchId: { in: branchIds },
        deletedAt: null,
      },
    });

    if (!existing) {
      throw new NotFoundError('Article', id);
    }

    // Soft delete
    await prisma.article.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });

    // Invalidate cache
    await cache.del(cacheKeys.article(id));
  }

  async checkAvailability(
    articleIds: string[],
    startDate: string,
    endDate: string,
    branchId: string,
    excludeReservationId?: string
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const results = await Promise.all(
      articleIds.map(async (articleId) => {
        const article = await prisma.article.findUnique({
          where: { id: articleId },
          select: {
            id: true,
            code: true,
            name: true,
            type: true,
            quantity: true,
            status: true,
          },
        });

        if (!article) {
          return {
            articleId,
            available: false,
            requestedQuantity: 1,
            availableQuantity: 0,
            conflicts: [],
          };
        }

        // Find overlapping reservations
        const conflicts = await prisma.reservationItem.findMany({
          where: {
            articleId,
            reservation: {
              id: excludeReservationId ? { not: excludeReservationId } : undefined,
              branchId,
              status: { notIn: ['CANCELLED', 'COMPLETED', 'RETURNED'] },
              OR: [
                {
                  startDate: { lte: end },
                  endDate: { gte: start },
                },
              ],
            },
          },
          include: {
            reservation: {
              include: {
                project: { select: { name: true } },
              },
            },
          },
        });

        const reservedQuantity = conflicts.reduce((sum, c) => sum + c.quantity, 0);
        const availableQuantity = Math.max(0, article.quantity - reservedQuantity);

        return {
          articleId,
          available: availableQuantity > 0,
          requestedQuantity: 1,
          availableQuantity,
          conflicts: conflicts.map((c) => ({
            reservationId: c.reservationId,
            projectName: c.reservation.project.name,
            startDate: c.reservation.startDate.toISOString(),
            endDate: c.reservation.endDate.toISOString(),
            quantity: c.quantity,
          })),
        };
      })
    );

    return {
      available: results.every((r) => r.available),
      items: results,
    };
  }

  private async generateCode(branchId: string): Promise<string> {
    // Get branch code prefix
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      select: { code: true },
    });

    const prefix = branch?.code.slice(0, 3).toUpperCase() || 'ART';

    // Get last article number
    const lastArticle = await prisma.article.findFirst({
      where: {
        code: { startsWith: prefix },
      },
      orderBy: { code: 'desc' },
      select: { code: true },
    });

    let nextNumber = 1;
    if (lastArticle) {
      const match = lastArticle.code.match(/(\d+)$/);
      if (match?.[1]) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    return `${prefix}${String(nextNumber).padStart(6, '0')}`;
  }
}
