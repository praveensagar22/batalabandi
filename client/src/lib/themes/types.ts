export interface ThemeSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export interface ThemeMarketing {
  tagline: string;
  buttonText: string;
  buttonUrl: string;
  campaignLabel?: 'Trending' | 'New' | 'Limited' | 'Exclusive' | 'Hot' | 'Bestseller';
}

export interface ThemeProductItem {
  id: string;
  name: string;
  category: string;
  productType: string;
  collection: string;
  price: string;
  stock: number;
  status: 'Active' | 'Draft' | 'Archived';
  image: string;
  salesCount: number;
}

export interface ThemeAnalyticsData {
  salesCount: number;
  revenue: string;
  views: number;
  conversionRate: string;
  wishlistCount: number;
  averageRating: number;
  monthlySales: { month: string; amount: number }[];
}

export interface Theme {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  productsCount: number;
  status: 'Active' | 'Draft' | 'Archived';
  featured: boolean;
  trending: boolean;
  showOnHomepage: boolean;
  homepagePriority: number;
  showInNav: boolean;
  createdDate: string;
  publishDate?: string;
  icon?: string;
  bannerImage?: string;
  thumbnailImage?: string;
  themeColor?: string;
  gradientColor?: string;
  compatibleCollections: string[];
  marketing: ThemeMarketing;
  seo: ThemeSEO;
  analytics: ThemeAnalyticsData;
  assignedProducts: ThemeProductItem[];
}

export type ThemeFilterState = {
  search: string;
  status: 'All' | 'Active' | 'Draft' | 'Archived';
  featured: 'All' | 'Yes' | 'No';
  collection: string;
  sortBy: 'name' | 'productsCount' | 'createdDate' | 'views';
};
