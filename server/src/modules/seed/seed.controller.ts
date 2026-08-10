import { Request, Response } from 'express';
import { Category } from '../categories/category.model';
import { Product } from '../products/product.model';
import { ProductType } from '../product-types/product-type.model';
import { CollectionModel } from '../collections/collection.model';
import { ThemeModel } from '../themes/theme.model';
import { AttributeModel } from '../attributes/attribute.model';
import { InventoryModel } from '../inventory/inventory.model';
import { User } from '../auth/user.model';
import { catchAsync } from '../../utils/catchAsync';

export class SeedController {
  static seedCatalog = catchAsync(async (req: Request, res: Response) => {
    // Seed Admin User
    let adminUser = await User.findOne({ email: 'admin@batalabandi.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'BatalaBandi Admin',
        email: 'admin@batalabandi.com',
        password: 'Admin@123',
        role: 'admin',
      });
    }
    // Seed Categories
    const categoryCount = await Category.countDocuments();
    let categoriesSeeded = false;
    if (categoryCount === 0) {
      await Category.create([
        { name: 'Men', slug: 'men', description: 'Men apparel collection', gender: 'Men', level: 0, status: 'Active', sortOrder: 1, parentId: null },
        { name: 'Women', slug: 'women', description: 'Women apparel collection', gender: 'Women', level: 0, status: 'Active', sortOrder: 2, parentId: null },
        { name: 'Tops', slug: 'men-tops', description: 'Upperwear tops', gender: 'Men', level: 1, status: 'Active', sortOrder: 1, parentId: 'men' },
        { name: 'Shirts', slug: 'shirts', description: 'Casual & formal shirts', gender: 'Men', level: 2, status: 'Active', sortOrder: 1, parentId: 'men-tops' },
        { name: 'Hoodies', slug: 'hoodies', description: 'Fleece hoodies & sweatshirts', gender: 'Unisex', level: 2, status: 'Active', sortOrder: 2, parentId: 'men-tops' },
        { name: 'Oversized T-Shirts', slug: 'oversized-tshirts', description: 'Drop shoulder streetwear tees', gender: 'Unisex', level: 2, status: 'Active', sortOrder: 3, parentId: 'men-tops' },
        { name: 'Bottoms', slug: 'bottoms', description: 'Pants, joggers & shorts', gender: 'Men', level: 1, status: 'Active', sortOrder: 2, parentId: 'men' },
        { name: 'Joggers', slug: 'joggers', description: 'Slim fit fleece joggers', gender: 'Men', level: 2, status: 'Active', sortOrder: 1, parentId: 'bottoms' },
      ]);
      categoriesSeeded = true;
    }

    // Seed Product Types
    const ptCount = await ProductType.countDocuments();
    let ptSeeded = false;
    if (ptCount === 0) {
      await ProductType.create([
        { name: 'Shirt', slug: 'shirt', description: 'Button down woven shirts', parentCategory: 'Tops', genderAvailability: ['Men', 'Women'], status: 'Active', featured: true, sortOrder: 1 },
        { name: 'Hoodie', slug: 'hoodie', description: 'Heavyweight fleece hoodies', parentCategory: 'Tops', genderAvailability: ['Men', 'Women', 'Unisex'], status: 'Active', featured: true, sortOrder: 2 },
        { name: 'Oversized T-Shirt', slug: 'oversized-tshirt', description: 'Drop shoulder heavy cotton tees', parentCategory: 'Tops', genderAvailability: ['Men', 'Women', 'Unisex'], status: 'Active', featured: true, sortOrder: 3 },
        { name: 'Kurta', slug: 'kurta', description: 'Traditional ethnic hand-crafted kurtas', parentCategory: 'Ethnic Wear', genderAvailability: ['Men', 'Women'], status: 'Active', featured: true, sortOrder: 4 },
        { name: 'Joggers', slug: 'joggers', description: 'Tapered athletic sweatpants', parentCategory: 'Bottoms', genderAvailability: ['Men', 'Women', 'Unisex'], status: 'Active', featured: false, sortOrder: 5 },
      ]);
      ptSeeded = true;
    }

    // Seed Collections
    const colCount = await CollectionModel.countDocuments();
    let colSeeded = false;
    if (colCount === 0) {
      await CollectionModel.create([
        { name: 'Painted', slug: 'painted', shortDescription: 'Hand-painted canvas artwork & brushstroke graphics.', status: 'Active', featured: true, showOnHomepage: true, homepagePriority: 1, promoLabel: 'Best Seller' },
        { name: 'Thread', slug: 'thread', shortDescription: 'Intricate embroidery & heavy thread work apparel.', status: 'Active', featured: true, showOnHomepage: true, homepagePriority: 2, promoLabel: 'Hot' },
        { name: 'Printed', slug: 'printed', shortDescription: 'High-density screen prints & vibrant DTG graphics.', status: 'Active', featured: false, showOnHomepage: true, homepagePriority: 3, promoLabel: 'Trending' },
        { name: 'Limited Edition', slug: 'limited-edition', shortDescription: 'Numbered collector drops & rare capsule releases.', status: 'Active', featured: true, showOnHomepage: true, homepagePriority: 4, promoLabel: 'Limited' },
        { name: 'Hand Painted', slug: 'hand-painted', shortDescription: 'Bespoke artisan hand-painted individual garments.', status: 'Active', featured: true, showOnHomepage: true, homepagePriority: 5, promoLabel: 'New' },
      ]);
      colSeeded = true;
    }

    // Seed Themes
    const themeCount = await ThemeModel.countDocuments();
    let themeSeeded = false;
    if (themeCount === 0) {
      await ThemeModel.create([
        { name: 'Anime', slug: 'anime', shortDescription: 'Japanese manga, cyberpunk & iconic anime art.', status: 'Active', featured: true, trending: true, showOnHomepage: true, homepagePriority: 1, compatibleCollections: ['Painted', 'Printed', 'Limited Edition'], marketing: { tagline: 'Unleash Your Inner Otaku Street Style', buttonText: 'Explore Anime Collection', buttonUrl: '/themes/anime', campaignLabel: 'Trending' } },
        { name: 'Marvel', slug: 'marvel', shortDescription: 'Superhero & classic comic book graphics.', status: 'Active', featured: true, trending: false, showOnHomepage: true, homepagePriority: 2, compatibleCollections: ['Printed', 'Thread', 'Limited Edition'], marketing: { tagline: 'Assemble Your Hero Wardrobe', buttonText: 'Shop Hero Graphics', buttonUrl: '/themes/marvel', campaignLabel: 'Bestseller' } },
        { name: 'Nature', slug: 'nature', shortDescription: 'Botanical, floral & wildlife hand-painted artwork.', status: 'Active', featured: true, trending: true, showOnHomepage: true, homepagePriority: 3, compatibleCollections: ['Painted', 'Hand Painted', 'Thread'], marketing: { tagline: 'Earthy Handcrafted Organic Fashion', buttonText: 'Discover Nature Art', buttonUrl: '/themes/nature', campaignLabel: 'Exclusive' } },
        { name: 'Quotes', slug: 'quotes', shortDescription: 'Bold typography, sarcastic & motivational callouts.', status: 'Active', featured: false, trending: false, showOnHomepage: false, homepagePriority: 4, compatibleCollections: ['Printed'], marketing: { tagline: 'Wear Your Attitude & Thoughts', buttonText: 'View Quote Tees', buttonUrl: '/themes/quotes', campaignLabel: 'Hot' } },
        { name: 'Gaming', slug: 'gaming', shortDescription: 'Esports, 8-bit retro arcade & console aesthetics.', status: 'Active', featured: true, trending: true, showOnHomepage: true, homepagePriority: 5, compatibleCollections: ['Printed', 'Limited Edition'], marketing: { tagline: 'Level Up Your Gaming Fit', buttonText: 'Explore Gaming Merch', buttonUrl: '/themes/gaming', campaignLabel: 'New' } },
      ]);
      themeSeeded = true;
    }

    // Seed Attributes
    const attrCount = await AttributeModel.countDocuments();
    let attrSeeded = false;
    if (attrCount === 0) {
      await AttributeModel.create([
        {
          name: 'Colors',
          slug: 'colors',
          description: 'Color swatches for products',
          type: 'Color Picker',
          enableFilter: true,
          visibleOnProductPage: true,
          required: true,
          sortingMode: 'Manual',
          status: 'Active',
          icon: 'Palette',
          values: [
            { id: 'v-black', name: 'Black', slug: 'black', displayLabel: 'Midnight Black', colorHex: '#000000', sortOrder: 1, productsCount: 248, status: 'Active' },
            { id: 'v-white', name: 'White', slug: 'white', displayLabel: 'Off White', colorHex: '#ffffff', sortOrder: 2, productsCount: 195, status: 'Active' },
            { id: 'v-red', name: 'Red', slug: 'red', displayLabel: 'Crimson Red', colorHex: '#ef4444', sortOrder: 3, productsCount: 112, status: 'Active' },
            { id: 'v-blue', name: 'Blue', slug: 'blue', displayLabel: 'Royal Blue', colorHex: '#3b82f6', sortOrder: 4, productsCount: 98, status: 'Active' },
            { id: 'v-navy', name: 'Navy', slug: 'navy', displayLabel: 'Dark Navy', colorHex: '#1e3a8a', sortOrder: 5, productsCount: 84, status: 'Active' },
            { id: 'v-emerald', name: 'Emerald', slug: 'emerald', displayLabel: 'Botanical Green', colorHex: '#10b981', sortOrder: 6, productsCount: 62, status: 'Active' },
          ],
        },
        {
          name: 'Sizes',
          slug: 'sizes',
          description: 'Standard apparel sizes',
          type: 'Text',
          enableFilter: true,
          visibleOnProductPage: true,
          required: true,
          sortingMode: 'Custom',
          status: 'Active',
          icon: 'Ruler',
          values: [
            { id: 'v-xs', name: 'XS', slug: 'xs', displayLabel: 'Extra Small (36")', sortOrder: 1, productsCount: 140, status: 'Active' },
            { id: 'v-s', name: 'S', slug: 's', displayLabel: 'Small (38")', sortOrder: 2, productsCount: 310, status: 'Active' },
            { id: 'v-m', name: 'M', slug: 'm', displayLabel: 'Medium (40")', sortOrder: 3, productsCount: 420, status: 'Active' },
            { id: 'v-l', name: 'L', slug: 'l', displayLabel: 'Large (42")', sortOrder: 4, productsCount: 450, status: 'Active' },
            { id: 'v-xl', name: 'XL', slug: 'xl', displayLabel: 'Extra Large (44")', sortOrder: 5, productsCount: 380, status: 'Active' },
            { id: 'v-xxl', name: 'XXL', slug: 'xxl', displayLabel: 'Double XL (46")', sortOrder: 6, productsCount: 220, status: 'Active' },
          ],
        },
        {
          name: 'Materials',
          slug: 'materials',
          description: 'Fabric compositions and textures',
          type: 'Text',
          enableFilter: true,
          visibleOnProductPage: true,
          required: false,
          sortingMode: 'Alphabetical',
          status: 'Active',
          icon: 'Layers',
          values: [
            { id: 'v-cotton-100', name: '100% Cotton', slug: '100-cotton', displayLabel: '100% Pure Combed Cotton (240 GSM)', sortOrder: 1, productsCount: 380, status: 'Active' },
            { id: 'v-cotton-blend', name: 'Cotton Blend', slug: 'cotton-blend', displayLabel: '80% Cotton / 20% Polyester', sortOrder: 2, productsCount: 140, status: 'Active' },
            { id: 'v-fleece', name: 'Fleece', slug: 'fleece', displayLabel: '330 GSM Heavy Brushed Fleece', sortOrder: 3, productsCount: 110, status: 'Active' },
            { id: 'v-french-terry', name: 'French Terry', slug: 'french-terry', displayLabel: '280 GSM Unbrushed French Terry', sortOrder: 4, productsCount: 75, status: 'Active' },
            { id: 'v-linen', name: 'Linen', slug: 'linen', displayLabel: 'Organic Slub Linen', sortOrder: 5, productsCount: 48, status: 'Active' },
          ],
        },
        {
          name: 'Fit Types',
          slug: 'fit-types',
          description: 'Apparel silhouette and fit cut',
          type: 'Text',
          enableFilter: true,
          visibleOnProductPage: true,
          required: true,
          sortingMode: 'Manual',
          status: 'Active',
          icon: 'Shirt',
          values: [
            { id: 'v-regular-fit', name: 'Regular Fit', slug: 'regular-fit', displayLabel: 'Classic Regular Fit', sortOrder: 1, productsCount: 290, status: 'Active' },
            { id: 'v-oversized', name: 'Oversized', slug: 'oversized', displayLabel: 'Drop Shoulder Oversized Fit', sortOrder: 2, productsCount: 380, status: 'Active' },
            { id: 'v-slim-fit', name: 'Slim Fit', slug: 'slim-fit', displayLabel: 'Tailored Slim Fit', sortOrder: 3, productsCount: 120, status: 'Active' },
            { id: 'v-relaxed-fit', name: 'Relaxed Fit', slug: 'relaxed-fit', displayLabel: 'Comfort Relaxed Cut', sortOrder: 4, productsCount: 95, status: 'Active' },
          ],
        },
      ]);
      attrSeeded = true;
    }

    // Seed Products
    const prodCount = await Product.countDocuments();
    let prodSeeded = false;
    if (prodCount < 8) {
      // Remove existing incomplete sample products if needed
      await Product.deleteMany({});
      await Product.create([
        {
          title: 'Cyber Samurai Oversized Heavyweight Tee',
          subtitle: '240 GSM drop shoulder Japanese cyberpunk street tee',
          slug: 'cyber-samurai-oversized-tee',
          description: 'Premium 240 GSM 100% combed cotton oversized t-shirt featuring high-density screen print artwork of a cyberpunk samurai.',
          sku: 'BB-TSH-001',
          barcode: '890123456789',
          price: 1490,
          compareAtPrice: 1990,
          costPrice: 580,
          stock: 35,
          lowStockThreshold: 5,
          status: 'Active',
          isFeatured: true,
          category: 'Tshirts',
          productType: 'Oversized T-Shirt',
          collectionName: 'Printed',
          themeName: 'Anime',
          gender: 'Unisex',
          colors: ['Black', 'White'],
          sizes: ['S', 'M', 'L', 'XL'],
          material: '100% Cotton',
          fitType: 'Oversized',
          images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'],
          thumbnail: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
          variants: [
            { id: 'v-001', sku: 'BB-TSH-001-BLK-M', color: 'Black', colorHex: '#000000', size: 'M', price: 1490, stock: 15 },
            { id: 'v-002', sku: 'BB-TSH-001-BLK-L', color: 'Black', colorHex: '#000000', size: 'L', price: 1490, stock: 20 },
          ],
          salesCount: 890,
          rating: 4.9,
        },
        {
          title: 'Neo Tokyo Heavyweight Fleece Hoodie',
          subtitle: '330 GSM ultra-soft fleece street hoodie',
          slug: 'neo-tokyo-heavyweight-hoodie',
          description: 'Ultra-warm 330 GSM fleece hoodie with double layered hood and kangaroo pocket.',
          sku: 'BB-HOD-002',
          price: 2790,
          compareAtPrice: 3490,
          costPrice: 1100,
          stock: 18,
          lowStockThreshold: 5,
          status: 'Active',
          isFeatured: true,
          category: 'Hoodies',
          productType: 'Hoodie',
          collectionName: 'Printed',
          themeName: 'Anime',
          gender: 'Unisex',
          colors: ['Black', 'Navy'],
          sizes: ['M', 'L', 'XL', 'XXL'],
          material: 'Fleece',
          fitType: 'Regular Fit',
          images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80'],
          thumbnail: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80',
          variants: [],
          salesCount: 1120,
          rating: 4.8,
        },
        {
          title: 'Lotus Bloom Hand Painted Linen Kurta',
          subtitle: 'Artisan handcrafted pure slub linen kurta',
          slug: 'lotus-bloom-hand-painted-kurta',
          description: 'Hand-painted floral lotus motif on breathable organic slub linen kurta for formal & festive occasions.',
          sku: 'BB-KRT-003',
          price: 2490,
          compareAtPrice: 2990,
          costPrice: 950,
          stock: 12,
          lowStockThreshold: 3,
          status: 'Active',
          isFeatured: true,
          category: 'Shirts',
          productType: 'Shirt',
          collectionName: 'Hand Painted',
          themeName: 'Nature',
          gender: 'Men',
          colors: ['White', 'Cream'],
          sizes: ['M', 'L', 'XL'],
          material: 'Linen',
          fitType: 'Regular Fit',
          images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'],
          thumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
          variants: [],
          salesCount: 520,
          rating: 4.9,
        },
        {
          title: 'Vintage Thread Work Denim Overshirt',
          subtitle: 'Heavyweight indigo denim with Kantha thread embroidery',
          slug: 'vintage-thread-work-denim-overshirt',
          description: 'Authentic 12 oz indigo washed cotton denim overshirt featuring hand thread embroidery details on back & pocket.',
          sku: 'BB-SHR-004',
          price: 2290,
          compareAtPrice: 2890,
          costPrice: 850,
          stock: 25,
          lowStockThreshold: 4,
          status: 'Active',
          isFeatured: true,
          category: 'Shirts',
          productType: 'Shirt',
          collectionName: 'Thread',
          themeName: 'Nature',
          gender: 'Men',
          colors: ['Blue'],
          sizes: ['S', 'M', 'L', 'XL'],
          material: '100% Cotton',
          fitType: 'Regular Fit',
          images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80'],
          thumbnail: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80',
          variants: [],
          salesCount: 640,
          rating: 4.9,
        },
        {
          title: 'Urban Utility Cargo Jogger Pants',
          subtitle: 'Tapered stretch twill cargo pants with 6 pockets',
          slug: 'urban-utility-cargo-jogger-pants',
          description: 'Durable stretch cotton twill cargo jogger pants with elasticated waistband and deep utility cargo pockets.',
          sku: 'BB-PNT-005',
          price: 1890,
          compareAtPrice: 2390,
          costPrice: 700,
          stock: 40,
          lowStockThreshold: 8,
          status: 'Active',
          isFeatured: false,
          category: 'Pants',
          productType: 'Joggers',
          collectionName: 'Printed',
          themeName: 'Gaming',
          gender: 'Men',
          colors: ['Black', 'Olive'],
          sizes: ['M', 'L', 'XL'],
          material: 'Cotton Blend',
          fitType: 'Slim Fit',
          images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80'],
          thumbnail: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=400&q=80',
          variants: [],
          salesCount: 780,
          rating: 4.7,
        },
        {
          title: 'Floral Embroidered Cotton Summer Dress',
          subtitle: 'Flowy A-line summer dress with delicate thread detailing',
          slug: 'floral-embroidered-cotton-summer-dress',
          description: 'Breathable 100% organic cotton dress adorned with hand-stitched floral embroidery along hem and sleeves.',
          sku: 'BB-DRS-006',
          price: 2190,
          compareAtPrice: 2790,
          costPrice: 800,
          stock: 15,
          lowStockThreshold: 3,
          status: 'Active',
          isFeatured: true,
          category: 'Women Tops',
          productType: 'Dress',
          collectionName: 'Thread',
          themeName: 'Nature',
          gender: 'Women',
          colors: ['White', 'Yellow'],
          sizes: ['XS', 'S', 'M', 'L'],
          material: '100% Cotton',
          fitType: 'Relaxed Fit',
          images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'],
          thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
          variants: [],
          salesCount: 430,
          rating: 4.9,
        },
        {
          title: 'Abstract Splash Hand Painted Crop Tee',
          subtitle: 'Artisanal splash brushstroke boxy crop t-shirt',
          slug: 'abstract-splash-hand-painted-crop-tee',
          description: 'Hand-painted abstract watercolor splash artwork on heavy cotton boxy crop tee.',
          sku: 'BB-TSH-007',
          price: 1390,
          compareAtPrice: 1790,
          costPrice: 500,
          stock: 22,
          lowStockThreshold: 4,
          status: 'Active',
          isFeatured: true,
          category: 'Tshirts',
          productType: 'T-Shirt',
          collectionName: 'Painted',
          themeName: 'Nature',
          gender: 'Women',
          colors: ['White', 'Pink'],
          sizes: ['S', 'M', 'L'],
          material: '100% Cotton',
          fitType: 'Oversized',
          images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80'],
          thumbnail: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80',
          variants: [],
          salesCount: 310,
          rating: 4.8,
        },
        {
          title: 'Minimalist Embroidered Canvas Cap',
          subtitle: '6-panel structured cotton twill dad cap',
          slug: 'minimalist-embroidered-canvas-cap',
          description: 'Structured 100% cotton twill cap with adjustable brass buckle and signature BatalaBandi embroidery.',
          sku: 'BB-CAP-008',
          price: 790,
          compareAtPrice: 990,
          costPrice: 280,
          stock: 50,
          lowStockThreshold: 10,
          status: 'Active',
          isFeatured: false,
          category: 'Caps',
          productType: 'Cap',
          collectionName: 'Thread',
          themeName: 'Quotes',
          gender: 'Unisex',
          colors: ['Black', 'Beige', 'Navy'],
          sizes: ['One Size'],
          material: 'Cotton Twill',
          fitType: 'Regular Fit',
          images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80'],
          thumbnail: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=400&q=80',
          variants: [],
          salesCount: 950,
          rating: 4.9,
        },
      ]);
      prodSeeded = true;
    }

    // Seed Inventory
    const invCount = await InventoryModel.countDocuments();
    let invSeeded = false;
    if (invCount === 0) {
      await InventoryModel.create([
        {
          sku: 'BB-TSH-001-BLK-M',
          productTitle: 'Cyber Samurai Oversized Heavyweight Tee',
          productImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
          category: 'Tops',
          color: 'Black',
          size: 'M',
          location: 'Main Warehouse (WH-01)',
          availableStock: 15,
          reservedStock: 2,
          lowStockThreshold: 5,
          unitCost: 580,
          status: 'In Stock',
          logs: [
            { id: 'log-001', changeAmount: 15, previousStock: 0, newStock: 15, reason: 'Initial Stock', note: 'Factory shipment received', user: 'Admin', timestamp: new Date() },
          ],
        },
        {
          sku: 'BB-TSH-001-BLK-L',
          productTitle: 'Cyber Samurai Oversized Heavyweight Tee',
          productImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
          category: 'Tops',
          color: 'Black',
          size: 'L',
          location: 'Main Warehouse (WH-01)',
          availableStock: 20,
          reservedStock: 3,
          lowStockThreshold: 5,
          unitCost: 580,
          status: 'In Stock',
          logs: [
            { id: 'log-002', changeAmount: 20, previousStock: 0, newStock: 20, reason: 'Initial Stock', note: 'Factory shipment received', user: 'Admin', timestamp: new Date() },
          ],
        },
        {
          sku: 'BB-HOD-002-BLK-XL',
          productTitle: 'Neo Tokyo Heavyweight Fleece Hoodie',
          productImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80',
          category: 'Tops',
          color: 'Black',
          size: 'XL',
          location: 'Fulfillment Center (WH-02)',
          availableStock: 4,
          reservedStock: 1,
          lowStockThreshold: 5,
          unitCost: 1100,
          status: 'Low Stock',
          logs: [
            { id: 'log-003', changeAmount: 4, previousStock: 0, newStock: 4, reason: 'Initial Stock', note: 'Winter drop batch', user: 'Admin', timestamp: new Date() },
          ],
        },
        {
          sku: 'BB-KRT-003-WHT-S',
          productTitle: 'Lotus Bloom Hand Painted Linen Kurta',
          productImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
          category: 'Ethnic Wear',
          color: 'White',
          size: 'S',
          location: 'Main Warehouse (WH-01)',
          availableStock: 0,
          reservedStock: 0,
          lowStockThreshold: 3,
          unitCost: 950,
          status: 'Out of Stock',
          logs: [
            { id: 'log-004', changeAmount: -5, previousStock: 5, newStock: 0, reason: 'Sale', note: 'Sold out during festive promo', user: 'System', timestamp: new Date() },
          ],
        },
      ]);
      invSeeded = true;
    }

    res.status(200).json({
      status: 'success',
      message: 'Catalog database seed completed successfully',
      seeded: { categoriesSeeded, ptSeeded, colSeeded, themeSeeded, attrSeeded, prodSeeded, invSeeded },
    });
  });
}
