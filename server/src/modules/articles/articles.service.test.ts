import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ArticlesService } from './articles.service';

const mockPrisma = {
  article: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
    updateMany: vi.fn(),
  },
  reservationItem: {
    findMany: vi.fn(),
  },
  stockMovement: {
    create: vi.fn(),
  },
};

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}));

vi.mock('@/lib/redis', () => ({
  cache: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
    delPattern: vi.fn(),
  },
}));

describe('ArticlesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getById', () => {
    it('should return article if found', async () => {
      const mockArticle = {
        id: 'article-1',
        code: 'ART-001',
        name: 'Test Article',
        type: 'SERIALIZED',
      };
      mockPrisma.article.findUnique.mockResolvedValue(mockArticle);

      const result = await ArticlesService.getById('article-1');

      expect(result).toEqual(mockArticle);
      expect(mockPrisma.article.findUnique).toHaveBeenCalledWith({
        where: { id: 'article-1' },
        include: expect.any(Object),
      });
    });

    it('should return null if not found', async () => {
      mockPrisma.article.findUnique.mockResolvedValue(null);

      const result = await ArticlesService.getById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('getByCode', () => {
    it('should find article by code', async () => {
      const mockArticle = {
        id: 'article-1',
        code: 'ART-001',
        name: 'Test Article',
      };
      mockPrisma.article.findFirst.mockResolvedValue(mockArticle);

      const result = await ArticlesService.getByCode('ART-001', 'branch-1');

      expect(result).toEqual(mockArticle);
      expect(mockPrisma.article.findFirst).toHaveBeenCalledWith({
        where: { code: 'ART-001', branchId: 'branch-1' },
        include: expect.any(Object),
      });
    });
  });

  describe('getByBarcode', () => {
    it('should find article by barcode', async () => {
      const mockArticle = {
        id: 'article-1',
        barcode: '1234567890123',
        name: 'Test Article',
      };
      mockPrisma.article.findFirst.mockResolvedValue(mockArticle);

      const result = await ArticlesService.getByBarcode('1234567890123', 'branch-1');

      expect(result).toEqual(mockArticle);
    });
  });

  describe('list', () => {
    it('should return paginated articles', async () => {
      const mockArticles = [
        { id: '1', name: 'Article 1' },
        { id: '2', name: 'Article 2' },
      ];
      mockPrisma.article.findMany.mockResolvedValue(mockArticles);
      mockPrisma.article.count.mockResolvedValue(2);

      const result = await ArticlesService.list('branch-1', {
        page: 1,
        limit: 20,
      });

      expect(result.data).toEqual(mockArticles);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.page).toBe(1);
    });

    it('should apply search filter', async () => {
      mockPrisma.article.findMany.mockResolvedValue([]);
      mockPrisma.article.count.mockResolvedValue(0);

      await ArticlesService.list('branch-1', {
        page: 1,
        limit: 20,
        search: 'test',
      });

      expect(mockPrisma.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({
                name: expect.objectContaining({ contains: 'test' }),
              }),
            ]),
          }),
        })
      );
    });

    it('should apply status filter', async () => {
      mockPrisma.article.findMany.mockResolvedValue([]);
      mockPrisma.article.count.mockResolvedValue(0);

      await ArticlesService.list('branch-1', {
        page: 1,
        limit: 20,
        status: 'AVAILABLE',
      });

      expect(mockPrisma.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'AVAILABLE',
          }),
        })
      );
    });
  });

  describe('create', () => {
    it('should create article with generated code', async () => {
      const mockArticle = {
        id: 'new-article',
        code: 'ART-ABC12345',
        name: 'New Article',
      };
      mockPrisma.article.findFirst.mockResolvedValue(null);
      mockPrisma.article.create.mockResolvedValue(mockArticle);

      const result = await ArticlesService.create('branch-1', {
        name: 'New Article',
        type: 'SERIALIZED',
        categoryId: 'cat-1',
      });

      expect(result).toEqual(mockArticle);
      expect(mockPrisma.article.create).toHaveBeenCalled();
    });

    it('should throw if code already exists', async () => {
      mockPrisma.article.findFirst.mockResolvedValue({ id: 'existing' });

      await expect(
        ArticlesService.create('branch-1', {
          code: 'EXISTING-CODE',
          name: 'New Article',
          type: 'SERIALIZED',
          categoryId: 'cat-1',
        })
      ).rejects.toThrow('Article code already exists');
    });
  });

  describe('update', () => {
    it('should update article', async () => {
      const mockArticle = {
        id: 'article-1',
        code: 'ART-001',
        name: 'Updated Article',
      };
      mockPrisma.article.findUnique.mockResolvedValue({ id: 'article-1', branchId: 'branch-1' });
      mockPrisma.article.update.mockResolvedValue(mockArticle);

      const result = await ArticlesService.update('article-1', 'branch-1', {
        name: 'Updated Article',
      });

      expect(result).toEqual(mockArticle);
    });

    it('should throw if article not found', async () => {
      mockPrisma.article.findUnique.mockResolvedValue(null);

      await expect(
        ArticlesService.update('nonexistent', 'branch-1', { name: 'Test' })
      ).rejects.toThrow('Article not found');
    });
  });

  describe('delete', () => {
    it('should delete article', async () => {
      mockPrisma.article.findUnique.mockResolvedValue({
        id: 'article-1',
        branchId: 'branch-1',
      });
      mockPrisma.article.delete.mockResolvedValue({ id: 'article-1' });

      await ArticlesService.delete('article-1', 'branch-1');

      expect(mockPrisma.article.delete).toHaveBeenCalledWith({
        where: { id: 'article-1' },
      });
    });
  });

  describe('checkAvailability', () => {
    it('should return available for no conflicts', async () => {
      mockPrisma.reservationItem.findMany.mockResolvedValue([]);

      const result = await ArticlesService.checkAvailability(
        'article-1',
        new Date('2024-06-15'),
        new Date('2024-06-20')
      );

      expect(result.available).toBe(true);
      expect(result.conflicts).toHaveLength(0);
    });

    it('should return conflicts if reservations overlap', async () => {
      mockPrisma.reservationItem.findMany.mockResolvedValue([
        {
          id: 'item-1',
          reservation: {
            id: 'res-1',
            number: 'RES-001',
            startDate: new Date('2024-06-10'),
            endDate: new Date('2024-06-18'),
          },
        },
      ]);

      const result = await ArticlesService.checkAvailability(
        'article-1',
        new Date('2024-06-15'),
        new Date('2024-06-20')
      );

      expect(result.available).toBe(false);
      expect(result.conflicts.length).toBeGreaterThan(0);
    });
  });

  describe('bulkUpdateStatus', () => {
    it('should update multiple articles', async () => {
      mockPrisma.article.updateMany.mockResolvedValue({ count: 3 });

      const result = await ArticlesService.bulkUpdateStatus(
        ['article-1', 'article-2', 'article-3'],
        'IN_MAINTENANCE',
        'branch-1'
      );

      expect(result.count).toBe(3);
      expect(mockPrisma.article.updateMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['article-1', 'article-2', 'article-3'] },
          branchId: 'branch-1',
        },
        data: { status: 'IN_MAINTENANCE' },
      });
    });
  });

  describe('generateArticleCode', () => {
    it('should generate unique code', async () => {
      mockPrisma.article.findFirst.mockResolvedValue(null);

      const code = await ArticlesService.generateArticleCode('ART');

      expect(code).toMatch(/^ART-[A-Z0-9]{8}$/);
    });
  });
});
