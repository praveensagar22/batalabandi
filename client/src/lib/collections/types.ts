export interface CollectionSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export interface CollectionMarketing {
  buttonText: string;
  buttonUrl: string;
  promoLabel?: 'New' | 'Hot' | 'Trending' | 'Limited' | 'Best Seller' | 'Handmade';
}

export interface CollectionProductItem {
  id: string;
  name: string;
  productType: string;
  theme: string;
  price: string;
  stock: number;
  status: 'Active' | 'Draft' | 'Archived';
  image: string;
  salesCount: number;
}

export interface CollectionAnalyticsData {
  salesCount: number;
  revenue: string;
  views: number;
  conversionRate: string;
  monthlySales: { month: string; amount: number }[];
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  detailedDescription: string;
  productsCount: number;
  status: 'Active' | 'Draft' | 'Inactive' | 'Archived';
  featured: boolean;
  showOnHomepage: boolean;
  homepagePriority: number;
  displayOrder: number;
  displayStyle: 'Card' | 'Banner' | 'Full Width';
  createdDate: string;
  publishDate?: string;
  icon?: string;
  coverImage?: string;
  bannerImage?: string;
  themeColor?: string;
  marketing: CollectionMarketing;
  seo: CollectionSEO;
  analytics: CollectionAnalyticsData;
  assignedProducts: CollectionProductItem[];
}

export type CollectionFilterState = {
  search: string;
  status: 'All' | 'Active' | 'Inactive' | 'Draft' | 'Archived';
  featured: 'All' | 'Yes' | 'No';
  sortBy: 'name' | 'productsCount' | 'createdDate';
};
