import { z } from 'zod'

// User schemas
export const UserRoleSchema = z.enum(['RENTER', 'OWNER', 'ADMIN'])
export const BookingStatusSchema = z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED'])
export const DepositStatusSchema = z.enum(['PENDING', 'PAID', 'REFUNDED', 'FORFEITED'])
export const PaymentMethodSchema = z.enum(['CASH', 'BANK_TRANSFER', 'MANUAL'])
export const CategoryStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED'])

// Auth schemas
export const RegisterSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(6),
  city: z.string().optional(),
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// Item schemas
export const CreateItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  dailyRate: z.number().positive(),
  weeklyRate: z.number().positive().optional(),
  monthlyRate: z.number().positive().optional(),
  city: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional(),
  minRentalDays: z.number().positive().default(1),
  maxRentalDays: z.number().positive().optional(),
  hasBasicInsurance: z.boolean().default(false),
  hasPremiumInsurance: z.boolean().default(false),
  insuranceDailyRate: z.number().positive().optional(),
  images: z.array(z.string()).default([]),
})

export const UpdateItemSchema = CreateItemSchema.partial()

// Booking schemas
export const CreateBookingSchema = z.object({
  itemId: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  hasInsurance: z.boolean().default(false),
  insuranceType: z.enum(['basic', 'premium']).optional(),
  renterNotes: z.string().optional(),
  paymentMethod: PaymentMethodSchema.default('MANUAL'),
})

// Risk assessment schemas
export const RiskInputsSchema = z.object({
  itemValue: z.number().positive(),
  rentalDuration: z.number().positive(),
  renterRating: z.number().min(0).max(5).optional(),
  itemCategory: z.string(),
  locationRisk: z.enum(['low', 'medium', 'high']).default('medium'),
  seasonality: z.enum(['low', 'medium', 'high']).default('medium'),
})

export const DepositQuoteSchema = z.object({
  baseDeposit: z.number(),
  riskMultiplier: z.number(),
  finalDeposit: z.number(),
  breakdown: z.object({
    baseAmount: z.number(),
    riskAdjustment: z.number(),
    durationAdjustment: z.number(),
    categoryAdjustment: z.number(),
  }),
})

export const PricingResultSchema = z.object({
  dailyRate: z.number(),
  totalAmount: z.number(),
  depositAmount: z.number(),
  insuranceAmount: z.number().optional(),
  breakdown: z.object({
    baseAmount: z.number(),
    insuranceCost: z.number().optional(),
    depositCost: z.number(),
  }),
})

// Message schemas
export const CreateMessageSchema = z.object({
  bookingId: z.string(),
  content: z.string().min(1),
})

// Review schemas
export const CreateReviewSchema = z.object({
  itemId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

// Category request schemas
export const CreateCategoryRequestSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
})

// API Response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
  error: z.string().optional(),
})

// Type exports
export type UserRole = z.infer<typeof UserRoleSchema>
export type BookingStatus = z.infer<typeof BookingStatusSchema>
export type DepositStatus = z.infer<typeof DepositStatusSchema>
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>
export type CategoryStatus = z.infer<typeof CategoryStatusSchema>

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type CreateItemInput = z.infer<typeof CreateItemSchema>
export type UpdateItemInput = z.infer<typeof UpdateItemSchema>
export type CreateBookingInput = z.infer<typeof CreateBookingSchema>
export type RiskInputs = z.infer<typeof RiskInputsSchema>
export type DepositQuote = z.infer<typeof DepositQuoteSchema>
export type PricingResult = z.infer<typeof PricingResultSchema>
export type CreateMessageInput = z.infer<typeof CreateMessageSchema>
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>
export type CreateCategoryRequestInput = z.infer<typeof CreateCategoryRequestSchema>
export type ApiResponse<T = any> = z.infer<typeof ApiResponseSchema> & { data?: T }
