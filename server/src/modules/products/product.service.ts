import { Product, IProduct } from './product.model';
import { InventoryModel } from '../inventory/inventory.model';
import { AppError } from '../../utils/appError';

export class ProductService {
  static async getAllProducts(query: any = {}) {
    const { category, search, minPrice, maxPrice, sort, page = 1, limit = 50 } = query;
    const filter: any = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(filter)
      .sort(sort ? sort : '-createdAt')
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(filter);

    return {
      products,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    };
  }

  static async getProductById(id: string) {
    const product = await Product.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }

  // Helper to sync Product stock changes with Inventory collection
  static async syncProductInventory(product: IProduct) {
    try {
      const variantsToSync =
        product.variants && product.variants.length > 0
          ? product.variants
          : [
              {
                id: product._id ? product._id.toString() : 'base',
                sku: product.sku,
                color: '',
                size: '',
                price: product.price,
                stock: product.stock,
              },
            ];

      for (const v of variantsToSync) {
        if (!v.sku) continue;

        const stockCount = Number(v.stock ?? product.stock ?? 0);
        let status: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
        if (stockCount === 0) status = 'Out of Stock';
        else if (stockCount <= (product.lowStockThreshold || 5)) status = 'Low Stock';

        const existingInv = await InventoryModel.findOne({ sku: v.sku });

        if (existingInv) {
          const prevStock = existingInv.availableStock;
          existingInv.availableStock = stockCount;
          existingInv.status = status;
          existingInv.productTitle = product.title;
          existingInv.productImage = product.thumbnail || product.images?.[0] || '';
          existingInv.category = product.category;
          existingInv.unitCost = product.costPrice || 0;

          if (prevStock !== stockCount) {
            existingInv.logs.unshift({
              id: `log-${Date.now()}-${Math.random().toString().slice(-3)}`,
              changeAmount: stockCount - prevStock,
              previousStock: prevStock,
              newStock: stockCount,
              reason: 'Audit Correction',
              note: 'Stock synced from Product Builder update',
              user: 'Admin',
              timestamp: new Date(),
            });
          }

          await existingInv.save();
        } else {
          await InventoryModel.create({
            sku: v.sku,
            productId: product._id,
            productTitle: product.title,
            productImage: product.thumbnail || product.images?.[0] || '',
            category: product.category,
            color: v.color || '',
            size: v.size || '',
            location: 'Main Warehouse (WH-01)',
            availableStock: stockCount,
            reservedStock: 0,
            lowStockThreshold: product.lowStockThreshold || 5,
            unitCost: product.costPrice || 0,
            status,
            logs: [
              {
                id: `log-${Date.now()}`,
                changeAmount: stockCount,
                previousStock: 0,
                newStock: stockCount,
                reason: 'Initial Stock',
                note: 'Auto-created during Product Builder creation',
                user: 'Admin',
                timestamp: new Date(),
              },
            ],
          });
        }
      }
    } catch (err) {
      console.error('Inventory sync error:', err);
    }
  }

  static async createProduct(data: any) {
    const rawSlug = (data.slug || data.title || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    let slug = rawSlug;
    const existing = await Product.findOne({ slug });
    if (existing) {
      slug = `${rawSlug}-${Date.now().toString().slice(-4)}`;
    }

    const { id, _id, ...cleanData } = data;
    const product = await Product.create({ ...cleanData, slug });
    await ProductService.syncProductInventory(product);
    return product;
  }

  static async updateProduct(id: string, data: Partial<IProduct>) {
    const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    await ProductService.syncProductInventory(product);
    return product;
  }

  static async deleteProduct(id: string) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    if (product.sku) {
      await InventoryModel.deleteMany({
        $or: [{ productId: product._id }, { sku: { $regex: product.sku, $options: 'i' } }],
      });
    }
    return product;
  }
}
