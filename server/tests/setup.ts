// =====================================================
// MatFlow - Test Setup
// =====================================================

import { beforeAll, afterAll } from 'vitest';

beforeAll(async () => {
  // Setup test environment
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://matflow:matflow_dev_password@localhost:5432/matflow_test';
  process.env.JWT_SECRET = 'test-secret-key-for-testing-purposes-only';
});

afterAll(async () => {
  // Cleanup
});
