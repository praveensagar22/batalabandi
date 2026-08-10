export interface CategorySEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  gender?: 'Men' | 'Women' | 'Unisex' | 'All';
  level: number; // 0 = Root (e.g. Men/Women/Unisex), 1 = Parent (e.g. Tops/Bottoms), 2 = Child (e.g. Shirts/Hoodies)
  productsCount: number;
  status: 'Active' | 'Inactive';
  sortOrder: number;
  image?: string;
  banner?: string;
  icon?: string;
  color?: string;
  showOnHomepage: boolean;
  featured: boolean;
  showInNav: boolean;
  displayPriority: number;
  seo: CategorySEO;
  children?: Category[];
}

export type CategoryFilterState = {
  search: string;
  status: 'All' | 'Active' | 'Inactive';
  level: 'All' | 'Root' | 'Parent' | 'Child';
  gender: 'All' | 'Men' | 'Women' | 'Unisex';
};
