export interface AttributeValueItem {
  id: string;
  name: string;
  slug: string;
  displayLabel: string;
  colorHex?: string;
  image?: string;
  sortOrder: number;
  productsCount: number;
  status: 'Active' | 'Inactive';
  assignedProducts?: { id: string; name: string; category: string; price: string }[];
}

export interface AttributeGroup {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: 'Text' | 'Color Picker' | 'Image Swatch' | 'Number' | 'Icon' | 'Multi Select';
  enableFilter: boolean;
  visibleOnProductPage: boolean;
  required: boolean;
  sortingMode: 'Alphabetical' | 'Custom' | 'Manual';
  status: 'Active' | 'Inactive';
  icon?: string;
  values: AttributeValueItem[];
}

export type AttributeFilterState = {
  search: string;
  status: 'All' | 'Active' | 'Inactive';
  sortBy: 'name' | 'productsCount' | 'sortOrder';
};
