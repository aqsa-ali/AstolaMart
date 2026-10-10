/**
 * Mock data matching Firestore structure.
 * To integrate with Firestore, replace each exported array/object
 * with the corresponding Firestore query (e.g. getDocs, onSnapshot).
 *
 * Firestore collections:
 *  - categories  → mockCategories
 *  - products    → mockProducts
 *  - users       → mockUsers
 *  - orders      → mockOrders
 */

// ─── Categories ──────────────────────────────────────────────────────────────
// Mirrors: categories/{categoryId}
// Seed data: only 3 default categories. Admin can add more at runtime via Redux.
export const mockCategories = [
  {
    id: 'cat-1',
    name: 'Lipstick',
    description: 'Matte, glossy and satin lip colours',
    image: 'color-palette-outline',
    isActive: true,
    sortOrder: 1,
    color: '#EC4899',
    subcategories: [
      { id: 'sub-1', name: 'Rose Cosmetics', description: 'Luxury velvet matte & satin lipsticks', image: '💄' },
      { id: 'sub-2', name: 'Luxé Beauty', description: 'High-shine liquid lip glosses', image: '💋' },
      { id: 'sub-3', name: 'Glow Lab', description: 'Hydrating tinted nude lip balms', image: '✨' },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-2',
    name: 'Foundation',
    description: 'Full-coverage and lightweight foundation products',
    image: 'brush-outline',
    isActive: true,
    sortOrder: 2,
    color: '#F59E0B',
    subcategories: [
      { id: 'sub-4', name: 'Luxé Beauty', description: 'Full coverage oil-free matte foundations', image: '🎨' },
      { id: 'sub-5', name: 'Glow Lab', description: 'Luminous liquid glow foundations', image: '✨' },
      { id: 'sub-6', name: 'Pure Care', description: 'Hydrating SPF 30 BB & CC creams', image: '🧴' },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-3',
    name: 'Skincare',
    description: 'Cleansers, toners and treatments',
    image: 'leaf-outline',
    isActive: true,
    sortOrder: 3,
    color: '#10B981',
    subcategories: [
      { id: 'sub-7', name: 'Natural Essence', description: 'Organic rose water mists & toners', image: '🌹' },
      { id: 'sub-8', name: 'Glow Lab', description: 'Hyaluronic acid hydration serums', image: '🧪' },
      { id: 'sub-9', name: 'Radiance Co.', description: 'Vitamin C skin brightening creams', image: '🌟' },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

// ─── Subcategories ────────────────────────────────────────────────────────────
// Mirrors: subcategories/{subcategoryId}
export const mockSubcategories = [
  { id: 'sub-1', categoryId: 'cat-1', name: 'Rose Cosmetics', description: 'Luxury velvet matte & satin lipsticks', image: '💄', isActive: true },
  { id: 'sub-2', categoryId: 'cat-1', name: 'Luxé Beauty', description: 'High-shine liquid lip glosses', image: '💋', isActive: true },
  { id: 'sub-3', categoryId: 'cat-1', name: 'Glow Lab', description: 'Hydrating tinted nude lip balms', image: '✨', isActive: true },
  { id: 'sub-4', categoryId: 'cat-2', name: 'Luxé Beauty', description: 'Full coverage oil-free matte foundations', image: '🎨', isActive: true },
  { id: 'sub-5', categoryId: 'cat-2', name: 'Glow Lab', description: 'Luminous liquid glow foundations', image: '✨', isActive: true },
  { id: 'sub-6', categoryId: 'cat-2', name: 'Pure Care', description: 'Hydrating SPF 30 BB & CC creams', image: '🧴', isActive: true },
  { id: 'sub-7', categoryId: 'cat-3', name: 'Natural Essence', description: 'Organic rose water mists & toners', image: '🌹', isActive: true },
  { id: 'sub-8', categoryId: 'cat-3', name: 'Glow Lab', description: 'Hyaluronic acid hydration serums', image: '🧪', isActive: true },
  { id: 'sub-9', categoryId: 'cat-3', name: 'Radiance Co.', description: 'Vitamin C skin brightening creams', image: '🌟', isActive: true },
]

// ─── Products ─────────────────────────────────────────────────────────────────
// Mirrors: products/{productId}
export const mockProducts = [
  // ─── Lipstick (cat-1) ───────────────────────────────
  {
    id: 'prod-1',
    name: 'Velvet Matte Lipstick',
    description: 'Rich velvet lipstick with intense long-lasting pigmentation.',
    categoryId: 'cat-1',
    categoryName: 'Lipstick',
    price: 18.50,
    discountPrice: 15.00,
    images: ['💄'],
    stock: 50,
    sku: 'LIP-001',
    brand: 'Rose Cosmetics',
    size: '3.5g',
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'prod-2',
    name: 'Satin Liquid Lip Gloss',
    description: 'High-shine non-sticky liquid gloss for luscious hydrated lips.',
    categoryId: 'cat-1',
    categoryName: 'Lipstick',
    price: 16.00,
    discountPrice: null,
    images: ['💋'],
    stock: 40,
    sku: 'LIP-002',
    brand: 'Luxé Beauty',
    size: '5ml',
    isActive: true,
    isFeatured: false,
    createdAt: '2024-01-11T00:00:00Z',
    updatedAt: '2024-01-11T00:00:00Z',
  },
  {
    id: 'prod-3',
    name: 'Nude Moisture Lip Balm',
    description: 'Hydrating tinted balm for everyday soft and natural looking lips.',
    categoryId: 'cat-1',
    categoryName: 'Lipstick',
    price: 12.50,
    discountPrice: 9.99,
    images: ['✨'],
    stock: 60,
    sku: 'LIP-003',
    brand: 'Glow Lab',
    size: '4g',
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  },

  // ─── Foundation (cat-2) ───────────────────────────────
  {
    id: 'prod-4',
    name: 'Full Coverage Matte Foundation',
    description: 'A full-coverage oil-free matte foundation that lasts all day.',
    categoryId: 'cat-2',
    categoryName: 'Foundation',
    price: 26.99,
    discountPrice: 22.00,
    images: ['🎨'],
    stock: 50,
    sku: 'FDN-001',
    brand: 'Luxé Beauty',
    size: '30ml',
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-13T00:00:00Z',
    updatedAt: '2024-01-13T00:00:00Z',
  },
  {
    id: 'prod-5',
    name: 'Luminous Glow Liquid Foundation',
    description: 'Light-reflecting formula for a radiant natural dew finish.',
    categoryId: 'cat-2',
    categoryName: 'Foundation',
    price: 29.50,
    discountPrice: null,
    images: ['✨'],
    stock: 35,
    sku: 'FDN-002',
    brand: 'Glow Lab',
    size: '30ml',
    isActive: true,
    isFeatured: false,
    createdAt: '2024-01-14T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z',
  },
  {
    id: 'prod-6',
    name: 'Hydrating Tinted BB Cream',
    description: 'Lightweight foundation BB cream infused with SPF 30.',
    categoryId: 'cat-2',
    categoryName: 'Foundation',
    price: 19.99,
    discountPrice: 16.50,
    images: ['🧴'],
    stock: 45,
    sku: 'FDN-003',
    brand: 'Pure Care',
    size: '50ml',
    isActive: true,
    isFeatured: false,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },

  // ─── Skincare (cat-3) ───────────────────────────────
  {
    id: 'prod-7',
    name: 'Rose Water Hydrating Toner',
    description: 'Soothing organic rose water toner to refresh and balance skin.',
    categoryId: 'cat-3',
    categoryName: 'Skincare',
    price: 14.99,
    discountPrice: 12.99,
    images: ['🌹'],
    stock: 60,
    sku: 'SKN-001',
    brand: 'Natural Essence',
    size: '150ml',
    isActive: true,
    isFeatured: false,
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z',
  },
  {
    id: 'prod-8',
    name: 'Hyaluronic Acid Serum',
    description: 'Intense hydration boost serum that plumps and smooths skin.',
    categoryId: 'cat-3',
    categoryName: 'Skincare',
    price: 32.00,
    discountPrice: 27.50,
    images: ['🧪'],
    stock: 30,
    sku: 'SKN-002',
    brand: 'Glow Lab',
    size: '50ml',
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-17T00:00:00Z',
    updatedAt: '2024-01-17T00:00:00Z',
  },
  {
    id: 'prod-9',
    name: 'Vitamin C Brightening Cream',
    description: 'Nourishing moisturiser infused with vitamin C for glowing skin.',
    categoryId: 'cat-3',
    categoryName: 'Skincare',
    price: 28.00,
    discountPrice: null,
    images: ['🌟'],
    stock: 40,
    sku: 'SKN-003',
    brand: 'Radiance Co.',
    size: '50ml',
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z',
  },
]

// ─── Users ────────────────────────────────────────────────────────────────────
// Mirrors: users/{userId}
export const mockUsers = [
  {
    id: 'usr-1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 212-555-0101',
    role: 'customer',          // 'customer' | 'admin'
    profileImage: null,
    isActive: true,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
  {
    id: 'usr-2',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '+1 213-555-0102',
    role: 'customer',
    profileImage: null,
    isActive: true,
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-06T00:00:00Z',
  },
  {
    id: 'usr-3',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '+1 312-555-0103',
    role: 'customer',
    profileImage: null,
    isActive: true,
    createdAt: '2024-01-07T00:00:00Z',
    updatedAt: '2024-01-07T00:00:00Z',
  },
  {
    id: 'usr-4',
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    phone: '+1 713-555-0104',
    role: 'customer',
    profileImage: null,
    isActive: true,
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
  },
  {
    id: 'usr-5',
    name: 'Jessica Brown',
    email: 'jessica.brown@example.com',
    phone: '+1 305-555-0105',
    role: 'customer',
    profileImage: null,
    isActive: false,
    createdAt: '2024-01-09T00:00:00Z',
    updatedAt: '2024-01-09T00:00:00Z',
  },
  {
    id: 'usr-admin',
    name: 'Admin User',
    email: 'admin@astolamart.com',
    phone: '+1 000-555-0000',
    role: 'admin',
    profileImage: null,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

// ─── Orders ───────────────────────────────────────────────────────────────────
// Mirrors: orders/{orderId}
export const mockOrders = [
  {
    id: 'ord-1',
    userId: 'usr-1',
    customerName: 'Sarah Johnson',
    customerPhone: '+1 212-555-0101',
    items: [
      { productId: 'prod-2', name: 'Velvet Matte Lipstick Set', quantity: 2, price: 45.00 },
      { productId: 'prod-18', name: 'Foundation Brush', quantity: 1, price: 34.50 },
    ],
    subtotal: 124.50,
    discount: 0,
    deliveryCharges: 0,
    total: 124.50,
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',       // 'Paid' | 'Pending' | 'Failed'
    orderStatus: 'Pending',      // 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
    shippingAddress: '123 Main St, New York, NY 10001',
    notes: '',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
]

// ─── Cart Items (local state seed — not a Firestore collection) ───────────────
export const mockCartItems = [
  {
    id: 'prod-2',
    name: 'Velvet Matte Lipstick',
    brand: 'Luxé Beauty',
    price: 18.50,
    quantity: 2,
    image: '💄',
    color: 'Pink',
  },
  {
    id: 'prod-3',
    name: 'Hydrating Serum',
    brand: 'Glow Lab',
    price: 32.00,
    quantity: 1,
    image: '🧪',
    color: 'N/A',
  },
  {
    id: 'prod-4',
    name: 'Volumizing Mascara',
    brand: 'Lash Pro',
    price: 15.75,
    quantity: 3,
    image: '👁️',
    color: 'Black',
  },
]

// ─── AddProduct category picker list ─────────────────────────────────────────
// Derived from mockCategories so it stays in sync automatically.
export const mockCategoryPickerItems = mockCategories.map(cat => ({
  id: cat.id,
  name: cat.name,
  icon: cat.image,
}))
