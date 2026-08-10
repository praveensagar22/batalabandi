import { Category } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  // --- MEN (Root, Level 0) ---
  {
    id: 'cat-men',
    name: 'Men',
    slug: 'men',
    description: 'Men\'s handcrafted apparel, streetwear, and traditional wear collection.',
    parentId: null,
    gender: 'Men',
    level: 0,
    productsCount: 601,
    status: 'Active',
    sortOrder: 1,
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    icon: 'User',
    color: '#3b82f6',
    showOnHomepage: true,
    featured: true,
    showInNav: true,
    displayPriority: 10,
    seo: {
      metaTitle: 'Men\'s Clothing & Ethnic Streetwear | BatalaBandi',
      metaDescription: 'Shop premium handcrafted men\'s shirts, hoodies, oversized tees, and kurtas.',
      keywords: 'men apparel, handcrafted menswear, hoodies, kurtas, street fashion',
    },
  },
  {
    id: 'cat-men-tops',
    name: 'Tops',
    slug: 'men-tops',
    description: 'Shirts, hoodies, sweatshirts, and t-shirts for men.',
    parentId: 'cat-men',
    gender: 'Men',
    level: 1,
    productsCount: 468,
    status: 'Active',
    sortOrder: 1,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=400&q=80',
    icon: 'Shirt',
    color: '#eab308',
    showOnHomepage: true,
    featured: false,
    showInNav: true,
    displayPriority: 9,
    seo: {
      metaTitle: 'Men\'s Tops & Shirts | BatalaBandi',
      metaDescription: 'Explore men\'s tops, shirts, and hoodies.',
      keywords: 'men tops, men shirts, hoodies',
    },
  },
  {
    id: 'cat-men-shirts',
    name: 'Shirts',
    slug: 'men-shirts',
    description: 'Casual, formal, and hand-painted printed shirts.',
    parentId: 'cat-men-tops',
    gender: 'Men',
    level: 2,
    productsCount: 128,
    status: 'Active',
    sortOrder: 1,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80',
    icon: 'Shirt',
    showOnHomepage: true,
    featured: true,
    showInNav: true,
    displayPriority: 8,
    seo: {
      metaTitle: 'Men\'s Handcrafted Shirts | BatalaBandi',
      metaDescription: 'Unique hand-painted and printed shirts for men.',
      keywords: 'mens shirts, printed shirts, cotton shirts',
    },
  },
  {
    id: 'cat-men-hoodies',
    name: 'Hoodies',
    slug: 'men-hoodies',
    description: 'Heavyweight graphic fleece hoodies and zip-ups.',
    parentId: 'cat-men-tops',
    gender: 'Men',
    level: 2,
    productsCount: 85,
    status: 'Active',
    sortOrder: 2,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80',
    icon: 'Flame',
    showOnHomepage: true,
    featured: true,
    showInNav: true,
    displayPriority: 7,
    seo: {
      metaTitle: 'Men\'s Graphic Hoodies | BatalaBandi',
      metaDescription: 'Warm oversized graphic fleece hoodies for men.',
      keywords: 'men hoodies, graphic fleece, streetwear hoodie',
    },
  },
  {
    id: 'cat-men-oversized-tees',
    name: 'Oversized T-Shirts',
    slug: 'men-oversized-tshirts',
    description: 'Drop-shoulder heavyweight 240 GSM streetwear tees.',
    parentId: 'cat-men-tops',
    gender: 'Men',
    level: 2,
    productsCount: 210,
    status: 'Active',
    sortOrder: 3,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
    icon: 'Sparkles',
    showOnHomepage: true,
    featured: true,
    showInNav: true,
    displayPriority: 8,
    seo: {
      metaTitle: 'Men\'s Oversized T-Shirts | BatalaBandi',
      metaDescription: 'Trending 240 GSM drop shoulder oversized streetwear tees.',
      keywords: 'oversized tshirts, drop shoulder, streetwear tees',
    },
  },
  {
    id: 'cat-men-bottoms',
    name: 'Bottoms',
    slug: 'men-bottoms',
    description: 'Trousers, joggers, jeans, and cargo pants.',
    parentId: 'cat-men',
    gender: 'Men',
    level: 1,
    productsCount: 133,
    status: 'Active',
    sortOrder: 2,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=400&q=80',
    icon: 'Layers',
    color: '#10b981',
    showOnHomepage: false,
    featured: false,
    showInNav: true,
    displayPriority: 6,
    seo: {
      metaTitle: 'Men\'s Pants & Bottomwear | BatalaBandi',
      metaDescription: 'Shop cargo pants, relaxed joggers, and denim for men.',
      keywords: 'men pants, cargo pants, joggers',
    },
  },
  {
    id: 'cat-men-joggers',
    name: 'Joggers',
    slug: 'men-joggers',
    description: 'Relaxed cotton blend joggers for everyday comfort.',
    parentId: 'cat-men-bottoms',
    gender: 'Men',
    level: 2,
    productsCount: 64,
    status: 'Active',
    sortOrder: 1,
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=400&q=80',
    showOnHomepage: false,
    featured: false,
    showInNav: true,
    displayPriority: 5,
    seo: {
      metaTitle: 'Men\'s Joggers & Sweatpants | BatalaBandi',
      metaDescription: 'Comfortable fleece and cotton joggers for men.',
      keywords: 'joggers, sweatpants, mens bottomwear',
    },
  },
  {
    id: 'cat-men-jeans',
    name: 'Jeans',
    slug: 'men-jeans',
    description: 'Straight fit, wide leg, and distressed denim jeans.',
    parentId: 'cat-men-bottoms',
    gender: 'Men',
    level: 2,
    productsCount: 69,
    status: 'Active',
    sortOrder: 2,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80',
    showOnHomepage: false,
    featured: false,
    showInNav: true,
    displayPriority: 4,
    seo: {
      metaTitle: 'Men\'s Denim Jeans | BatalaBandi',
      metaDescription: 'Durable denim jeans in straight and wide leg cuts.',
      keywords: 'denim jeans, mens jeans, wide leg denim',
    },
  },

  // --- WOMEN (Root, Level 0) ---
  {
    id: 'cat-women',
    name: 'Women',
    slug: 'women',
    description: 'Hand-crafted women\'s fusion wear, ethnic tops, sarees, and streetwear.',
    parentId: null,
    gender: 'Women',
    level: 0,
    productsCount: 472,
    status: 'Active',
    sortOrder: 2,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80',
    icon: 'Heart',
    color: '#ec4899',
    showOnHomepage: true,
    featured: true,
    showInNav: true,
    displayPriority: 10,
    seo: {
      metaTitle: 'Women\'s Handcrafted Fashion & Sarees | BatalaBandi',
      metaDescription: 'Shop handcrafted kurtis, crop tops, sarees, dupattas, and hoodies for women.',
      keywords: 'women fashion, sarees, dupattas, kurtis, women tops',
    },
  },
  {
    id: 'cat-women-tops',
    name: 'Tops',
    slug: 'women-tops',
    description: 'Crop tops, shirts, and oversized hoodies for women.',
    parentId: 'cat-women',
    gender: 'Women',
    level: 1,
    productsCount: 340,
    status: 'Active',
    sortOrder: 1,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    icon: 'Shirt',
    showOnHomepage: true,
    featured: false,
    showInNav: true,
    displayPriority: 8,
    seo: {
      metaTitle: 'Women\'s Tops & Crop Tops | BatalaBandi',
      metaDescription: 'Trendy handcrafted women\'s tops and oversized shirts.',
      keywords: 'women tops, crop tops, printed tops',
    },
  },
  {
    id: 'cat-women-shirts',
    name: 'Shirts',
    slug: 'women-shirts',
    description: 'Relaxed linen shirts, tie-up tops, and floral prints.',
    parentId: 'cat-women-tops',
    gender: 'Women',
    level: 2,
    productsCount: 110,
    status: 'Active',
    sortOrder: 1,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=400&q=80',
    showOnHomepage: false,
    featured: true,
    showInNav: true,
    displayPriority: 7,
    seo: {
      metaTitle: 'Women\'s Casual & Printed Shirts | BatalaBandi',
      metaDescription: 'Handcrafted floral and cotton shirts for women.',
      keywords: 'women shirts, floral shirts, linen shirts',
    },
  },
  {
    id: 'cat-women-hoodies',
    name: 'Hoodies',
    slug: 'women-hoodies',
    description: 'Pastel fleece hoodies and cropped zip sweatshirts.',
    parentId: 'cat-women-tops',
    gender: 'Women',
    level: 2,
    productsCount: 74,
    status: 'Active',
    sortOrder: 2,
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=400&q=80',
    showOnHomepage: false,
    featured: false,
    showInNav: true,
    displayPriority: 6,
    seo: {
      metaTitle: 'Women\'s Cozy Hoodies | BatalaBandi',
      metaDescription: 'Pastel oversized and cropped hoodies for women.',
      keywords: 'women hoodies, pastel hoodies, cropped fleece',
    },
  },
  {
    id: 'cat-women-ethnic',
    name: 'Ethnic Wear',
    slug: 'women-ethnic',
    description: 'Hand-loom sarees, zari border dupattas, and Anarkali suits.',
    parentId: 'cat-women',
    gender: 'Women',
    level: 1,
    productsCount: 132,
    status: 'Active',
    sortOrder: 2,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
    icon: 'Sparkles',
    color: '#8b5cf6',
    showOnHomepage: true,
    featured: true,
    showInNav: true,
    displayPriority: 9,
    seo: {
      metaTitle: 'Women\'s Handcrafted Ethnic Wear & Sarees | BatalaBandi',
      metaDescription: 'Exquisite hand-loom sarees, dupattas, and ethnic ensembles.',
      keywords: 'handloom sarees, zari dupatta, ethnic suits',
    },
  },
  {
    id: 'cat-women-sarees',
    name: 'Sarees & Dupattas',
    slug: 'women-sarees-dupattas',
    description: 'Kantha stitch silk sarees and hand-block printed dupattas.',
    parentId: 'cat-women-ethnic',
    gender: 'Women',
    level: 2,
    productsCount: 88,
    status: 'Active',
    sortOrder: 1,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80',
    showOnHomepage: true,
    featured: true,
    showInNav: true,
    displayPriority: 8,
    seo: {
      metaTitle: 'Handcrafted Sarees & Dupattas | BatalaBandi',
      metaDescription: 'Traditional silk sarees with kantha stitch and zari detailing.',
      keywords: 'silk sarees, dupattas, kantha stitch',
    },
  },
  {
    id: 'cat-women-anarkalis',
    name: 'Anarkalis',
    slug: 'women-anarkalis',
    description: 'Floor-length embroidered Anarkali sets for festive occasions.',
    parentId: 'cat-women-ethnic',
    gender: 'Women',
    level: 2,
    productsCount: 44,
    status: 'Inactive',
    sortOrder: 2,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
    showOnHomepage: false,
    featured: false,
    showInNav: false,
    displayPriority: 3,
    seo: {
      metaTitle: 'Festive Anarkali Suits | BatalaBandi',
      metaDescription: 'Embroidered festive Anarkalis for weddings and celebrations.',
      keywords: 'anarkalis, ethnic suits, festive wear',
    },
  },

  // --- UNISEX (Root, Level 0) ---
  {
    id: 'cat-unisex',
    name: 'Unisex',
    slug: 'unisex',
    description: 'Gender-fluid streetwear, oversized fits, and lifestyle accessories.',
    parentId: null,
    gender: 'Unisex',
    level: 0,
    productsCount: 497,
    status: 'Active',
    sortOrder: 3,
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80',
    icon: 'Sparkles',
    color: '#06b6d4',
    showOnHomepage: true,
    featured: true,
    showInNav: true,
    displayPriority: 10,
    seo: {
      metaTitle: 'Unisex Streetwear & Accessories | BatalaBandi',
      metaDescription: 'Shop gender-neutral oversized graphic tees, hoodies, and canvas bags.',
      keywords: 'unisex fashion, streetwear, graphic tees, tote bags',
    },
  },
  {
    id: 'cat-unisex-tops',
    name: 'Tops',
    slug: 'unisex-tops',
    description: 'Oversized graphic t-shirts and hoodies designed for everyone.',
    parentId: 'cat-unisex',
    gender: 'Unisex',
    level: 1,
    productsCount: 450,
    status: 'Active',
    sortOrder: 1,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80',
    showOnHomepage: true,
    featured: true,
    showInNav: true,
    displayPriority: 9,
    seo: {
      metaTitle: 'Unisex Oversized Tees & Hoodies | BatalaBandi',
      metaDescription: 'Gender-fluid oversized graphic t-shirts and heavy hoodies.',
      keywords: 'unisex tees, graphic tees, oversized hoodie',
    },
  },
  {
    id: 'cat-unisex-oversized-tees',
    name: 'Oversized Tees',
    slug: 'unisex-oversized-tees',
    description: 'Relaxed unisex 240 GSM organic cotton streetwear graphic tees.',
    parentId: 'cat-unisex-tops',
    gender: 'Unisex',
    level: 2,
    productsCount: 310,
    status: 'Active',
    sortOrder: 1,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=400&q=80',
    showOnHomepage: true,
    featured: true,
    showInNav: true,
    displayPriority: 10,
    seo: {
      metaTitle: 'Unisex Oversized Graphic Tees | BatalaBandi',
      metaDescription: 'Top rated 240 GSM organic cotton unisex graphic tees.',
      keywords: 'unisex graphic tees, anime tees, artist apparel',
    },
  },
  {
    id: 'cat-unisex-graphic-hoodies',
    name: 'Graphic Hoodies',
    slug: 'unisex-graphic-hoodies',
    description: 'Artist edition screen-printed heavyweight unisex hoodies.',
    parentId: 'cat-unisex-tops',
    gender: 'Unisex',
    level: 2,
    productsCount: 140,
    status: 'Active',
    sortOrder: 2,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80',
    showOnHomepage: true,
    featured: true,
    showInNav: true,
    displayPriority: 8,
    seo: {
      metaTitle: 'Artist Edition Graphic Hoodies | BatalaBandi',
      metaDescription: 'Limited edition screen printed heavyweight hoodies.',
      keywords: 'artist hoodies, streetwear hoodie, limited edition',
    },
  },
];

// Helper to build nested tree structure cleanly
export function buildCategoryTree(categories: Category[]): Category[] {
  const map = new Map<string, Category>();
  const slugToIdMap = new Map<string, string>();
  const roots: Category[] = [];

  // 1. First pass: Map all categories by id and slug
  categories.forEach((cat) => {
    map.set(cat.id, { ...cat, children: [] });
    if (cat.slug) {
      slugToIdMap.set(cat.slug, cat.id);
    }
  });

  // 2. Second pass: Build parent-child hierarchy
  categories.forEach((cat) => {
    const node = map.get(cat.id)!;
    
    // Determine effective parent ID (check direct id match, or slug match)
    let parentId = cat.parentId ? String(cat.parentId) : null;
    if (parentId && parentId !== 'null' && !map.has(parentId) && slugToIdMap.has(parentId)) {
      parentId = slugToIdMap.get(parentId)!;
    }

    if (parentId && parentId !== 'null' && map.has(parentId) && parentId !== cat.id) {
      const parentNode = map.get(parentId)!;
      if (!parentNode.children) parentNode.children = [];
      parentNode.children.push(node);
    } else {
      roots.push(node);
    }
  });

  // 3. Sort nodes recursively by level and sortOrder
  const sortNodes = (nodes: Category[]) => {
    nodes.sort((a, b) => (a.sortOrder || 1) - (b.sortOrder || 1));
    nodes.forEach((n) => {
      if (n.children && n.children.length > 0) {
        sortNodes(n.children);
      }
    });
  };

  sortNodes(roots);
  return roots;
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
