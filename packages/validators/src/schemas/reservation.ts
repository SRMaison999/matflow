// =====================================================
// MatFlow - Reservation & Project Validation Schemas
// =====================================================

import { z } from 'zod';
import {
  uuidSchema,
  isoDateSchema,
  addressSchema,
  moneySchema,
  contactInfoSchema,
  reservationStatusSchema,
  projectStatusSchema,
  projectTypeSchema,
} from './common';

// ----- Create Project -----
export const createProjectSchema = z.object({
  code: z.string().max(50).optional(),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  type: projectTypeSchema,
  clientId: uuidSchema.optional(),
  branchId: uuidSchema,
  branchIds: z.array(uuidSchema).optional(),
  managerId: uuidSchema,
  teamMemberIds: z.array(uuidSchema).optional(),
  startDate: isoDateSchema,
  endDate: isoDateSchema,
  setupDate: isoDateSchema.optional(),
  teardownDate: isoDateSchema.optional(),
  venueAddress: addressSchema.optional(),
  venueName: z.string().max(200).optional(),
  estimatedBudget: moneySchema.optional(),
  notes: z.string().max(5000).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  color: z.string().max(20).optional(),
}).refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
  message: 'Start date must be before end date',
  path: ['endDate'],
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

// ----- Update Project -----
export const updateProjectSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  type: projectTypeSchema.optional(),
  status: projectStatusSchema.optional(),
  clientId: uuidSchema.nullable().optional(),
  branchIds: z.array(uuidSchema).optional(),
  managerId: uuidSchema.optional(),
  teamMemberIds: z.array(uuidSchema).optional(),
  startDate: isoDateSchema.optional(),
  endDate: isoDateSchema.optional(),
  setupDate: isoDateSchema.nullable().optional(),
  teardownDate: isoDateSchema.nullable().optional(),
  venueAddress: addressSchema.nullable().optional(),
  venueName: z.string().max(200).nullable().optional(),
  venueContact: contactInfoSchema.nullable().optional(),
  estimatedBudget: moneySchema.nullable().optional(),
  actualCost: moneySchema.nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
  internalNotes: z.string().max(5000).nullable().optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  color: z.string().max(20).nullable().optional(),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

// ----- Project Query -----
export const projectQuerySchema = z.object({
  search: z.string().optional(),
  type: projectTypeSchema.optional(),
  status: projectStatusSchema.optional(),
  clientId: uuidSchema.optional(),
  branchId: uuidSchema.optional(),
  managerId: uuidSchema.optional(),
  startDateFrom: isoDateSchema.optional(),
  startDateTo: isoDateSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.string().optional(),
});

export type ProjectQueryInput = z.infer<typeof projectQuerySchema>;

// ----- Create Reservation -----
export const createReservationSchema = z.object({
  code: z.string().max(50).optional(),
  name: z.string().max(200).optional(),
  projectId: uuidSchema,
  branchId: uuidSchema,
  startDate: isoDateSchema,
  endDate: isoDateSchema,
  pickupDate: isoDateSchema.optional(),
  returnDate: isoDateSchema.optional(),
  deliveryAddress: addressSchema.optional(),
  pickupAddress: addressSchema.optional(),
  items: z.array(
    z.object({
      articleId: uuidSchema,
      instanceId: uuidSchema.optional(),
      quantity: z.number().int().positive(),
      unitPrice: moneySchema.optional(),
      discount: moneySchema.optional(),
      notes: z.string().max(500).optional(),
    })
  ).min(1),
  notes: z.string().max(5000).optional(),
  internalNotes: z.string().max(5000).optional(),
}).refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
  message: 'Start date must be before end date',
  path: ['endDate'],
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;

// ----- Update Reservation -----
export const updateReservationSchema = z.object({
  name: z.string().max(200).optional(),
  status: reservationStatusSchema.optional(),
  startDate: isoDateSchema.optional(),
  endDate: isoDateSchema.optional(),
  pickupDate: isoDateSchema.nullable().optional(),
  returnDate: isoDateSchema.nullable().optional(),
  deliveryAddress: addressSchema.nullable().optional(),
  pickupAddress: addressSchema.nullable().optional(),
  discountRate: z.number().min(0).max(100).optional(),
  notes: z.string().max(5000).nullable().optional(),
  internalNotes: z.string().max(5000).nullable().optional(),
  pickingNotes: z.string().max(5000).nullable().optional(),
});

export type UpdateReservationInput = z.infer<typeof updateReservationSchema>;

// ----- Add Reservation Items -----
export const addReservationItemsSchema = z.object({
  items: z.array(
    z.object({
      articleId: uuidSchema,
      instanceId: uuidSchema.optional(),
      quantity: z.number().int().positive(),
      unitPrice: moneySchema.optional(),
      discount: moneySchema.optional(),
      notes: z.string().max(500).optional(),
    })
  ).min(1),
});

export type AddReservationItemsInput = z.infer<typeof addReservationItemsSchema>;

// ----- Update Reservation Item -----
export const updateReservationItemSchema = z.object({
  quantity: z.number().int().positive().optional(),
  unitPrice: moneySchema.optional(),
  discount: moneySchema.optional(),
  notes: z.string().max(500).nullable().optional(),
  caseId: uuidSchema.nullable().optional(),
});

export type UpdateReservationItemInput = z.infer<typeof updateReservationItemSchema>;

// ----- Reservation Query -----
export const reservationQuerySchema = z.object({
  search: z.string().optional(),
  status: reservationStatusSchema.optional(),
  projectId: uuidSchema.optional(),
  branchId: uuidSchema.optional(),
  startDateFrom: isoDateSchema.optional(),
  startDateTo: isoDateSchema.optional(),
  endDateFrom: isoDateSchema.optional(),
  endDateTo: isoDateSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.string().optional(),
});

export type ReservationQueryInput = z.infer<typeof reservationQuerySchema>;

// ----- Availability Check -----
export const availabilityCheckSchema = z.object({
  articleIds: z.array(uuidSchema).min(1),
  startDate: isoDateSchema,
  endDate: isoDateSchema,
  branchId: uuidSchema,
  excludeReservationId: uuidSchema.optional(),
}).refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
  message: 'Start date must be before end date',
  path: ['endDate'],
});

export type AvailabilityCheckInput = z.infer<typeof availabilityCheckSchema>;

// ----- Client -----
export const createClientSchema = z.object({
  code: z.string().max(50).optional(),
  type: z.enum(['company', 'individual']),
  name: z.string().min(1).max(200),
  legalName: z.string().max(200).optional(),
  vatNumber: z.string().max(50).optional(),
  billingAddress: addressSchema,
  shippingAddress: addressSchema.optional(),
  contact: contactInfoSchema,
  paymentTerms: z.number().int().nonnegative().optional(),
  discountRate: z.number().min(0).max(100).optional(),
  branchId: uuidSchema,
  notes: z.string().max(5000).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;

export const updateClientSchema = createClientSchema.partial().omit({ branchId: true });

export type UpdateClientInput = z.infer<typeof updateClientSchema>;
