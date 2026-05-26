export type SellerStatus = 'approved' | 'pending' | 'rejected' | 'removed'
export type UserRole = 'admin' | 'seller' | 'staff'

export interface Category {
  id: string
  name: string
  createdAt?: string
  updatedAt?: string
}

export interface Product {
  id: string
  name: string
  price: number
  stock: number
  brand: string
  category: string
  categoryId: string
  imageUrl?: string
  createdAt: string
}

export interface SellerProduct extends Product {
  sellerId: string
}

export interface ProductUpsertPayload {
  name: string
  price: number
  stock: number
  brand: string
  category: string
  categoryId: string
  imageFile?: File | null
  condition?: 'new' | 'used'
}

export interface SellerProductUpsertPayload extends ProductUpsertPayload {
  imageUrl?: string
}

export interface Seller {
  id: string
  name: string
  email: string
  businessName: string
  phoneNumber: string
  location: string
  tinNumber: string
  password?: string
  status: SellerStatus
  removed?: boolean
  removalReason?: string
  removedAt?: string
  rejectionReason?: string
  rejectedAt?: string
  sellerDiscountPercent: number
  joinedAt: string
}

export interface AdminAccount {
  id: string
  name: string
  email: string
  role: string
  joinedAt: string
}

export interface Reservation {
  id: string
  productId: string
  productName: string
  sellerId: string
  sellerName: string
  quantity: number
  baseTotal: number
  finalTotal: number
  discountPercent?: number
  status: 'pending' | 'approved' | 'rejected' | 'delivered'
  createdAt: string
  deliveredAt?: string
  rejectedAt?: string
  rejectionReason?: string
}

export interface SiteSettings {
  id: number
  commissionPercent: number
  contactPhone: string
  contactAddress: string
  businessHours: string
  tiktokUrl: string
  mapUrl: string
  heroTagline: string
  heroTitle: string
  heroDescription: string
  aboutTitle: string
  aboutDescription: string
  yearsExperience: number
  studentsTrained: number
  updatedAt?: string
}

export interface AuthUser {
  role: UserRole
  id: string
  name: string
  email: string
  businessName?: string
  phoneNumber?: string
  location?: string
  tinNumber?: string
  sellerStatus?: SellerStatus
  sellerDiscountPercent?: number
  removalReason?: string
  rejectionReason?: string
  removedAt?: string
  rejectedAt?: string
}

export interface ProductFilters {
  query: string
  category: string
  brand: string
  minPrice: number
  maxPrice: number
  availability: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock'
  sortBy: 'newest' | 'price-asc' | 'price-desc'
}

export interface ToastMessage {
  id: string
  title: string
  description: string
  type: 'success' | 'warning' | 'info'
}
