import { Product } from '../products/product.model';
import { Order } from '../orders/order.model';
import { User } from '../auth/user.model';
import { Category } from '../categories/category.model';

export class AdminService {
  static async getDashboardStats() {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Total sales calculation from paid/delivered orders
    const totalSalesAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } },
    ]);

    const totalSales = totalSalesAgg[0]?.totalSales || 0;

    // Recent 5 orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Low stock products alert (stock < 5)
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } }).select('title stock price category');

    return {
      totalUsers,
      totalProducts,
      totalCategories,
      totalOrders,
      totalSales,
      recentOrders,
      lowStockProducts,
    };
  }

  static async getAllUsers() {
    return await User.find().select('-password').sort({ createdAt: -1 });
  }

  static async updateUserRole(userId: string, role: 'user' | 'admin') {
    return await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
  }
}
