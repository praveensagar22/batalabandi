import { apiRequest, formatImageUrl } from './client';
import { Category } from '@/lib/categories/types';
import { ProductType } from '@/lib/product-types/types';
import { Collection } from '@/lib/collections/types';
import { Theme } from '@/lib/themes/types';
import { AttributeGroup } from '@/lib/attributes/types';
import { ProductItem } from '@/lib/products/types';
import { InventoryItem } from '@/lib/inventory/types';
import { BannerItem, CouponItem } from '@/lib/marketing/types';

// Seed initial database
export async function seedCatalogDB() {
  return apiRequest<{ status: string; message: string }>('/seed', {
    method: 'POST',
  });
}

// ----------------------------------------------------
// CATEGORIES API
// ----------------------------------------------------
const CATEGORY_IMAGE_MAP: Record<string, string> = {
  men: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=400&q=80',
  women: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80',
  unisex: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80',
  tops: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=400&q=80',
  'men-tops': 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=400&q=80',
  'women-tops': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'unisex-tops': 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80',
  shirts: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80',
  'men-shirts': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80',
  'women-shirts': 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=400&q=80',
  hoodies: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80',
  'men-hoodies': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80',
  'women-hoodies': 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=400&q=80',
  'oversized-tshirts': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
  'men-oversized-tshirts': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
  'unisex-oversized-tees': 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=400&q=80',
  bottoms: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=400&q=80',
  'men-bottoms': 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=400&q=80',
  joggers: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=400&q=80',
  'men-joggers': 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=400&q=80',
  ethnic: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
  'women-ethnic': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
  sarees: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80',
  'women-sarees-dupattas': 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80',
};

export async function fetchCategoriesAPI(): Promise<Category[]> {
  const response = await apiRequest<{ data: { categories: any[] } }>('/categories');
  return response.data.categories.map((c) => {
    const rawImage = c.image || '';
    const fallbackImage =
      CATEGORY_IMAGE_MAP[c.slug] ||
      CATEGORY_IMAGE_MAP[c.name.toLowerCase()] ||
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80';

    const finalImage = rawImage ? formatImageUrl(rawImage) : fallbackImage;
    const finalBanner = c.banner ? formatImageUrl(c.banner) : finalImage;

    return {
      id: c._id || c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      parentId: c.parentId || null,
      gender: c.gender || 'Unisex',
      level: c.level || 0,
      productsCount: c.productsCount || 0,
      status: c.status || 'Active',
      sortOrder: c.sortOrder || 1,
      image: finalImage,
      banner: finalBanner,
      icon: c.icon || 'Tag',
      color: c.color || '#facc15',
      showOnHomepage: c.showOnHomepage ?? true,
      featured: c.featured ?? false,
      showInNav: c.showInNav ?? true,
      displayPriority: c.displayPriority || 5,
      seo: c.seo || { metaTitle: '', metaDescription: '', keywords: '' },
      children: [],
    };
  });
}

export async function createCategoryAPI(data: Partial<Category>): Promise<Category> {
  const res = await apiRequest<{ data: { category: any } }>('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const c = res.data.category;
  return { ...c, id: c._id || c.id };
}

export async function updateCategoryAPI(id: string, data: Partial<Category>): Promise<Category> {
  const res = await apiRequest<{ data: { category: any } }>(`/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  const c = res.data.category;
  return { ...c, id: c._id || c.id };
}

export async function deleteCategoryAPI(id: string): Promise<void> {
  await apiRequest(`/categories/${id}`, {
    method: 'DELETE',
  });
}

// ----------------------------------------------------
// PRODUCT TYPES API
// ----------------------------------------------------
export async function fetchProductTypesAPI(): Promise<ProductType[]> {
  const response = await apiRequest<{ data: { productTypes: any[] } }>('/product-types');
  return response.data.productTypes.map((pt) => ({
    id: pt._id || pt.id,
    name: pt.name,
    slug: pt.slug,
    shortDescription: pt.description || '',
    fullDescription: pt.description || '',
    parentCategory: pt.parentCategory || 'Tops',
    genderAvailability: pt.genderAvailability || ['Men', 'Women', 'Unisex'],
    productsCount: pt.productsCount || 0,
    featured: pt.featured ?? false,
    status: pt.status || 'Active',
    sortOrder: pt.sortOrder || 1,
    priority: pt.sortOrder || 1,
    icon: pt.icon || 'Shirt',
    image: pt.image || '',
    color: '#facc15',
    showInNav: true,
    showOnHomepage: true,
    defaults: {
      sizeChart: pt.defaults?.sizeChartTemplate || 'Standard Topwear (S-XXL)',
      material: pt.defaults?.fabricMaterial || '100% Cotton (220 GSM)',
      taxClass: pt.defaults?.taxClass || 'Apparel 5% GST',
      shippingClass: pt.defaults?.shippingClass || 'Standard Parcel',
    },
    seo: { metaTitle: '', metaDescription: '', keywords: '' },
    createdDate: new Date(pt.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    assignedProducts: [],
  }));
}

export async function createProductTypeAPI(data: Partial<ProductType>): Promise<ProductType> {
  const res = await apiRequest<{ data: { productType: any } }>('/product-types', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const pt = res.data.productType;
  return { ...pt, id: pt._id || pt.id };
}

export async function updateProductTypeAPI(id: string, data: Partial<ProductType>): Promise<ProductType> {
  const res = await apiRequest<{ data: { productType: any } }>(`/product-types/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  const pt = res.data.productType;
  return { ...pt, id: pt._id || pt.id };
}

export async function deleteProductTypeAPI(id: string): Promise<void> {
  await apiRequest(`/product-types/${id}`, { method: 'DELETE' });
}

// ----------------------------------------------------
// COLLECTIONS API
// ----------------------------------------------------
export async function fetchCollectionsAPI(): Promise<Collection[]> {
  const response = await apiRequest<{ data: { collections: any[] } }>('/collections');
  return response.data.collections.map((col) => ({
    id: col._id || col.id,
    name: col.name,
    slug: col.slug,
    shortDescription: col.shortDescription || '',
    detailedDescription: col.fullDescription || col.shortDescription || '',
    productsCount: col.productsCount || 0,
    status: col.status || 'Active',
    featured: col.featured ?? false,
    showOnHomepage: col.showOnHomepage ?? true,
    homepagePriority: col.homepagePriority || 1,
    displayOrder: col.homepagePriority || 1,
    displayStyle: col.displayStyle || 'Card',
    createdDate: new Date(col.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    icon: col.icon || 'Palette',
    coverImage: formatImageUrl(col.bannerImage || ''),
    bannerImage: formatImageUrl(col.bannerImage || ''),
    marketing: {
      buttonText: col.buttonText || 'Explore Collection',
      buttonUrl: col.buttonUrl || '/collections',
      promoLabel: col.promoLabel || 'Trending',
    },
    seo: {
      metaTitle: col.seoTitle || '',
      metaDescription: col.seoDescription || '',
      keywords: col.seoKeywords || '',
    },
    analytics: { salesCount: 0, revenue: '₹0', views: 0, conversionRate: '0.0%', monthlySales: [] },
    assignedProducts: [],
  }));
}

export async function createCollectionAPI(data: Partial<Collection>): Promise<Collection> {
  const body = {
    name: data.name,
    slug: data.slug,
    shortDescription: data.shortDescription,
    fullDescription: data.detailedDescription,
    status: data.status,
    featured: data.featured,
    showOnHomepage: data.showOnHomepage,
    homepagePriority: data.homepagePriority,
    icon: data.icon,
    bannerImage: data.bannerImage || data.coverImage,
    thumbnailImage: data.coverImage,
    displayStyle: data.displayStyle,
    buttonText: data.marketing?.buttonText,
    buttonUrl: data.marketing?.buttonUrl,
    promoLabel: data.marketing?.promoLabel,
    seoTitle: data.seo?.metaTitle,
    seoDescription: data.seo?.metaDescription,
    seoKeywords: data.seo?.keywords,
  };
  const res = await apiRequest<{ data: { collection: any } }>('/collections', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  const col = res.data.collection;
  return { ...col, id: col._id || col.id };
}

export async function updateCollectionAPI(id: string, data: Partial<Collection>): Promise<Collection> {
  const body = {
    ...data,
    fullDescription: data.detailedDescription,
    buttonText: data.marketing?.buttonText,
    buttonUrl: data.marketing?.buttonUrl,
    promoLabel: data.marketing?.promoLabel,
    seoTitle: data.seo?.metaTitle,
    seoDescription: data.seo?.metaDescription,
    seoKeywords: data.seo?.keywords,
  };
  const res = await apiRequest<{ data: { collection: any } }>(`/collections/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  const col = res.data.collection;
  return { ...col, id: col._id || col.id };
}

export async function deleteCollectionAPI(id: string): Promise<void> {
  await apiRequest(`/collections/${id}`, { method: 'DELETE' });
}

// ----------------------------------------------------
// THEMES API
// ----------------------------------------------------
export async function fetchThemesAPI(): Promise<Theme[]> {
  const response = await apiRequest<{ data: { themes: any[] } }>('/themes');
  return response.data.themes.map((t) => ({
    id: t._id || t.id,
    name: t.name,
    slug: t.slug,
    shortDescription: t.shortDescription || '',
    fullDescription: t.fullDescription || '',
    productsCount: t.productsCount || 0,
    status: t.status || 'Active',
    featured: t.featured ?? false,
    trending: t.trending ?? false,
    showOnHomepage: t.showOnHomepage ?? true,
    homepagePriority: t.homepagePriority || 1,
    showInNav: t.showInNav ?? true,
    createdDate: new Date(t.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    icon: t.icon || 'Sparkles',
    bannerImage: formatImageUrl(t.bannerImage || ''),
    thumbnailImage: formatImageUrl(t.thumbnailImage || ''),
    themeColor: t.themeColor || '#ef4444',
    gradientColor: t.gradientColor || 'from-red-500 to-amber-500',
    compatibleCollections: t.compatibleCollections || ['Painted', 'Printed'],
    marketing: t.marketing || { tagline: '', buttonText: 'Explore Theme', buttonUrl: '/themes', campaignLabel: 'Trending' },
    seo: t.seo || { metaTitle: '', metaDescription: '', keywords: '' },
    analytics: { salesCount: 0, revenue: '₹0', views: 0, conversionRate: '0.0%', wishlistCount: 0, averageRating: 4.9, monthlySales: [] },
    assignedProducts: [],
  }));
}

export async function createThemeAPI(data: Partial<Theme>): Promise<Theme> {
  const res = await apiRequest<{ data: { theme: any } }>('/themes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const t = res.data.theme;
  return { ...t, id: t._id || t.id };
}

export async function updateThemeAPI(id: string, data: Partial<Theme>): Promise<Theme> {
  const res = await apiRequest<{ data: { theme: any } }>(`/themes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  const t = res.data.theme;
  return { ...t, id: t._id || t.id };
}

export async function deleteThemeAPI(id: string): Promise<void> {
  await apiRequest(`/themes/${id}`, { method: 'DELETE' });
}

// ----------------------------------------------------
// ATTRIBUTES API
// ----------------------------------------------------
export async function fetchAttributesAPI(): Promise<AttributeGroup[]> {
  const response = await apiRequest<{ data: { attributes: any[] } }>('/attributes');
  return response.data.attributes.map((attr) => ({
    id: attr._id || attr.id,
    name: attr.name,
    slug: attr.slug,
    description: attr.description || '',
    type: attr.type || 'Text',
    enableFilter: attr.enableFilter ?? true,
    visibleOnProductPage: attr.visibleOnProductPage ?? true,
    required: attr.required ?? false,
    sortingMode: attr.sortingMode || 'Manual',
    status: attr.status || 'Active',
    icon: attr.icon || 'Tag',
    values: attr.values || [],
  }));
}

export async function createAttributeAPI(data: Partial<AttributeGroup>): Promise<AttributeGroup> {
  const res = await apiRequest<{ data: { attribute: any } }>('/attributes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const attr = res.data.attribute;
  return { ...attr, id: attr._id || attr.id };
}

export async function updateAttributeAPI(id: string, data: Partial<AttributeGroup>): Promise<AttributeGroup> {
  const res = await apiRequest<{ data: { attribute: any } }>(`/attributes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  const attr = res.data.attribute;
  return { ...attr, id: attr._id || attr.id };
}

export async function deleteAttributeAPI(id: string): Promise<void> {
  await apiRequest(`/attributes/${id}`, { method: 'DELETE' });
}

// ----------------------------------------------------
// PRODUCTS API
// ----------------------------------------------------
export async function fetchProductsAPI(): Promise<ProductItem[]> {
  const response = await apiRequest<{ data: { products: any[] } }>('/products');
  return response.data.products.map((p) => {
    const formattedDate = new Date(p.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    return {
      id: p._id || p.id,
      title: p.title,
      name: p.title,
      subtitle: p.subtitle || '',
      slug: p.slug,
      description: p.description || '',
      sku: p.sku || 'BB-PROD',
      barcode: p.barcode || '',
      price: p.price || 0,
      compareAtPrice: p.compareAtPrice || 0,
      costPrice: p.costPrice || 0,
      stock: p.stock || 0,
      lowStockThreshold: p.lowStockThreshold || 5,
      status: p.status || (p.stock <= 0 ? 'Out of Stock' : 'Active'),
      isFeatured: p.isFeatured ?? false,
      category: typeof p.category === 'object' ? p.category.name : p.category || 'Tops',
      productType: p.productType || 'Shirt',
      collectionName: p.collectionName || '',
      collection: p.collectionName || '',
      themeName: p.themeName || '',
      theme: p.themeName || '',
      gender: p.gender || 'Unisex',
      colors: p.colors || [],
      sizes: p.sizes || [],
      material: p.material || '',
      fitType: p.fitType || '',
      images: (p.images || []).map((img: string) => formatImageUrl(img)),
      thumbnail: formatImageUrl(p.thumbnail || p.images?.[0] || ''),
      variants: p.variants || [],
      seo: p.seo || { metaTitle: '', metaDescription: '', keywords: '' },
      salesCount: p.salesCount || 0,
      rating: p.rating || 4.8,
      createdDate: formattedDate,
      createdAt: formattedDate,
    };
  });
}

export async function createProductAPI(data: Partial<ProductItem>): Promise<ProductItem> {
  const res = await apiRequest<{ data: { product: any } }>('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const p = res.data.product;
  return { ...p, id: p._id || p.id };
}

export async function updateProductAPI(id: string, data: Partial<ProductItem>): Promise<ProductItem> {
  const res = await apiRequest<{ data: { product: any } }>(`/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  const p = res.data.product;
  return { ...p, id: p._id || p.id };
}

export async function deleteProductAPI(id: string): Promise<void> {
  await apiRequest(`/products/${id}`, { method: 'DELETE' });
}

// ----------------------------------------------------
// INVENTORY API
// ----------------------------------------------------
export async function fetchInventoryAPI(): Promise<InventoryItem[]> {
  const response = await apiRequest<{ data: { items: any[] } }>('/inventory');
  return response.data.items.map((item) => ({
    id: item._id || item.id,
    sku: item.sku,
    productTitle: item.productTitle,
    productImage: item.productImage || '',
    category: item.category || 'Tops',
    color: item.color || '',
    size: item.size || '',
    location: item.location || 'Main Warehouse (WH-01)',
    availableStock: item.availableStock || 0,
    reservedStock: item.reservedStock || 0,
    lowStockThreshold: item.lowStockThreshold || 5,
    unitCost: item.unitCost || 0,
    status: item.status || 'In Stock',
    logs: (item.logs || []).map((l: any) => ({
      id: l._id || l.id,
      changeAmount: l.changeAmount,
      previousStock: l.previousStock,
      newStock: l.newStock,
      reason: l.reason,
      note: l.note || '',
      user: l.user || 'Admin',
      timestamp: new Date(l.timestamp || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    })),
    updatedAt: new Date(item.updatedAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  }));
}

export async function adjustStockAPI(
  id: string,
  changeAmount: number,
  reason: string,
  note?: string
): Promise<InventoryItem> {
  const res = await apiRequest<{ data: { item: any } }>(`/inventory/${id}/adjust`, {
    method: 'POST',
    body: JSON.stringify({ changeAmount, reason, note, user: 'Admin' }),
  });
  const item = res.data.item;
  return {
    ...item,
    id: item._id || item.id,
    updatedAt: new Date(item.updatedAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  };
}

export async function deleteInventoryAPI(id: string): Promise<void> {
  await apiRequest(`/inventory/${id}`, { method: 'DELETE' });
}

// ----------------------------------------------------
// MARKETING API (BANNERS & COUPONS)
// ----------------------------------------------------
export async function fetchBannersAPI(): Promise<BannerItem[]> {
  const res = await apiRequest<{ data: { banners: any[] } }>('/marketing/banners');
  return res.data.banners.map((b) => ({
    id: b._id || b.id,
    title: b.title,
    subtitle: b.subtitle || '',
    image: formatImageUrl(b.image),
    ctaText: b.ctaText || 'Shop Collection',
    targetLink: b.targetLink || '/categories',
    position: b.position || 'Hero Carousel',
    sortOrder: b.sortOrder || 1,
    status: b.status || 'Active',
    clicksCount: b.clicksCount || 0,
  }));
}

export async function createBannerAPI(data: Partial<BannerItem>): Promise<BannerItem> {
  const res = await apiRequest<{ data: { banner: any } }>('/marketing/banners', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const b = res.data.banner;
  return { ...b, id: b._id || b.id };
}

export async function deleteBannerAPI(id: string): Promise<void> {
  await apiRequest(`/marketing/banners/${id}`, { method: 'DELETE' });
}

export async function fetchCouponsAPI(): Promise<CouponItem[]> {
  const res = await apiRequest<{ data: { coupons: any[] } }>('/marketing/coupons');
  return res.data.coupons.map((c) => ({
    id: c._id || c.id,
    code: c.code,
    description: c.description || '',
    discountType: c.discountType || 'Percentage',
    discountValue: c.discountValue || 10,
    minPurchaseAmount: c.minPurchaseAmount || 0,
    maxDiscountAmount: c.maxDiscountAmount || 0,
    usageLimit: c.usageLimit || 100,
    usedCount: c.usedCount || 0,
    status: c.status || 'Active',
  }));
}

export async function createCouponAPI(data: Partial<CouponItem>): Promise<CouponItem> {
  const res = await apiRequest<{ data: { coupon: any } }>('/marketing/coupons', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const c = res.data.coupon;
  return { ...c, id: c._id || c.id };
}

export async function deleteCouponAPI(id: string): Promise<void> {
  await apiRequest(`/marketing/coupons/${id}`, { method: 'DELETE' });
}
