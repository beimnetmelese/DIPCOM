export type SellerStatus = 'approved' | 'pending' | 'rejected'
export type UserRole = 'admin' | 'seller'

export interface Product {
  id: string
  name: string
  price: number
  stock: number
  brand: string
  category: string
  imageUrl?: string
  createdAt: string
}

export interface Seller {
  id: string
  name: string
  email: string
  businessName: string
  password: string
  status: SellerStatus
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
  status: 'active' | 'delivered' | 'removed'
  createdAt: string
  deliveredAt?: string
  removedAt?: string
}

export interface AuthUser {
  role: UserRole
  id: string
  name: string
  email: string
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
