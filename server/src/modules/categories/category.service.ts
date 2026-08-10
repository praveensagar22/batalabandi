import { Category, ICategory } from './category.model';
import { AppError } from '../../utils/appError';

export class CategoryService {
  static async getAllCategories() {
    return await Category.find().sort({ sortOrder: 1, createdAt: -1 });
  }

  static async getCategoryById(id: string) {
    const category = await Category.findById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }
    return category;
  }

  static async createCategory(data: Partial<ICategory>) {
    if (!data.name) {
      throw new AppError('Category name is required', 400);
    }
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const existing = await Category.findOne({ slug });
    if (existing) {
      throw new AppError('Category with this name or slug already exists', 400);
    }
    return await Category.create({ ...data, slug });
  }

  static async updateCategory(id: string, data: Partial<ICategory>) {
    let updateData = { ...data };
    if (data.name && !data.slug) {
      updateData.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const category = await Category.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!category) {
      throw new AppError('Category not found', 404);
    }
    return category;
  }

  static async deleteCategory(id: string) {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }
    return category;
  }
}
