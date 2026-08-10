export interface ProductTypeDefaults {
  sizeChart: string;
  material: string;
  taxClass: string;
  shippingClass: string;
}

export interface ProductTypeSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage?: string;
}

export interface AssignedProductSample {
  id: string;
  name: string;
  price: string;
  salesCount: number;
  image: string;
  createdDate: string;
}

export interface ProductType {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  parentCategory: string; // e.g. Tops, Bottoms, Ethnic Wear, Accessories
  genderAvailability: ('Men' | 'Women' | 'Unisex')[];
  productsCount: number;
  featured: boolean;
  status: 'Active' | 'Inactive' | 'Archived';
  sortOrder: number;
  priority: number;
  icon?: string;
  image?: string;
  color?: string;
  showInNav: boolean;
  showOnHomepage: boolean;
  createdDate: string;
  defaults: ProductTypeDefaults;
  seo: ProductTypeSEO;
  assignedProducts?: AssignedProductSample[];
}

export type ProductTypeFilterState = {
  search: string;
  status: 'All' | 'Active' | 'Inactive' | 'Archived';
  category: string;
  gender: string;
  featured: 'All' | 'Yes' | 'No';
};
