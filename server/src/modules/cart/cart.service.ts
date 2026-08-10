import { Cart, ICartItem } from './cart.model';
import { Product } from '../products/product.model';
import { AppError } from '../../utils/appError';

export interface CouponResult {
  code: string;
  isValid: boolean;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  message: string;
}

export class CartService {
  // Fetch cart document from MongoDB
  static async getCartBySessionId(sessionId: string) {
    if (!sessionId) {
      throw new AppError('Session ID is required', 400);
    }
    let cart = await Cart.findOne({ sessionId });
    if (!cart) {
      cart = await Cart.create({ sessionId, items: [] });
    }
    return cart;
  }

  // Add item directly to MongoDB cart
  static async addItemToCart(sessionId: string, itemData: any) {
    if (!sessionId) {
      throw new AppError('Session ID is required', 400);
    }

    const { productId, quantity = 1, color = 'Standard', size = 'M' } = itemData;

    // Fetch product details from MongoDB
    const product = await Product.findOne({
      $or: [{ _id: productId }, { id: productId }, { slug: productId }],
    });

    if (!product) {
      throw new AppError('Product not found in database', 404);
    }

    let cart = await Cart.findOne({ sessionId });
    if (!cart) {
      cart = new Cart({ sessionId, items: [] });
    }

    const image =
      product.thumbnail ||
      (product.images && product.images.length > 0 ? product.images[0] : '');

    // Check if item exists in MongoDB cart array
    const existingIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === product._id.toString() &&
        item.color === color &&
        item.size === size
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
      cart.items[existingIndex].price = product.price;
      cart.items[existingIndex].image = image;
    } else {
      cart.items.push({
        productId: product._id,
        title: product.title,
        subtitle: product.subtitle,
        price: product.price,
        image,
        color,
        size,
        quantity: Number(quantity),
      });
    }

    await cart.save();
    return cart;
  }

  private static isItemMatch(item: any, itemId: string): boolean {
    if (!item || !itemId) return false;
    const idStr = String(itemId);
    const dbId = item._id ? String(item._id) : '';
    const prodId = item.productId ? String(item.productId) : '';

    return (
      dbId === idStr ||
      prodId === idStr ||
      idStr.startsWith(prodId) ||
      idStr.startsWith(dbId) ||
      (prodId.length > 5 && idStr.includes(prodId))
    );
  }

  // Update item quantity in MongoDB cart
  static async updateItemQuantity(sessionId: string, itemId: string, quantity: number) {
    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter((item) => !CartService.isItemMatch(item, itemId));
    } else {
      const item = cart.items.find((i) => CartService.isItemMatch(i, itemId));
      if (item) {
        item.quantity = quantity;
      }
    }

    await cart.save();
    return cart;
  }

  // Remove item from MongoDB cart
  static async removeItemFromCart(sessionId: string, itemId: string) {
    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    cart.items = cart.items.filter((item) => !CartService.isItemMatch(item, itemId));

    await cart.save();
    return cart;
  }

  // Clear all items from MongoDB cart
  static async clearCartBySessionId(sessionId: string) {
    const cart = await Cart.findOne({ sessionId });
    if (cart) {
      cart.items = [];
      cart.couponCode = '';
      await cart.save();
    }
    return cart;
  }

  // Calculate cart directly from MongoDB cart document
  static async calculateCart(sessionId: string, inputItems?: any[], couponCode?: string) {
    let cart = await Cart.findOne({ sessionId });

    // If inputItems provided or no cart in DB, use inputItems or database items
    const dbItems = cart?.items || [];
    const itemsToProcess = inputItems && inputItems.length > 0 ? inputItems : dbItems;
    const activeCoupon = couponCode || cart?.couponCode || '';

    const calculatedItems: any[] = [];
    let subtotal = 0;
    let originalTotal = 0;

    for (const item of itemsToProcess) {
      const pId = item.productId || item._id;
      if (!pId) continue;

      const product = await Product.findOne({
        $or: [{ _id: pId }, { id: pId }, { slug: pId }],
      });

      if (!product) continue;

      const qty = Math.max(1, item.quantity || 1);
      const price = product.price;
      const compareAtPrice = product.compareAtPrice || product.price;

      const itemSubtotal = price * qty;
      const itemOriginalTotal = compareAtPrice * qty;

      subtotal += itemSubtotal;
      originalTotal += itemOriginalTotal;

      const image =
        product.thumbnail ||
        (product.images && product.images.length > 0 ? product.images[0] : '');

      calculatedItems.push({
        id: item._id ? item._id.toString() : `${product._id.toString()}-${item.color || 'def'}-${item.size || 'def'}`,
        productId: product._id.toString(),
        title: product.title,
        subtitle: product.subtitle,
        price,
        compareAtPrice,
        image,
        color: item.color || 'Standard',
        size: item.size || 'M',
        quantity: qty,
        itemSubtotal,
        itemOriginalTotal,
        inStock: (product.stock || 0) >= qty,
      });
    }

    const productDiscount = Math.max(0, originalTotal - subtotal);

    // Coupon Calculation
    let couponResult: CouponResult | null = null;
    let couponDiscount = 0;

    if (activeCoupon && activeCoupon.trim()) {
      const code = activeCoupon.trim().toUpperCase();
      if (code === 'WELCOME10' || code === 'BATALA10') {
        couponDiscount = Math.round((subtotal * 10) / 100);
        couponResult = {
          code,
          isValid: true,
          discountType: 'percentage',
          discountValue: 10,
          discountAmount: couponDiscount,
          message: '10% Welcome Discount Applied! 🎉',
        };
      } else if (code === 'FESTIVE15') {
        couponDiscount = Math.round((subtotal * 15) / 100);
        couponResult = {
          code,
          isValid: true,
          discountType: 'percentage',
          discountValue: 15,
          discountAmount: couponDiscount,
          message: '15% Festive Discount Applied! 🌟',
        };
      } else if (code === 'BATALA200') {
        couponDiscount = Math.min(200, subtotal);
        couponResult = {
          code,
          isValid: true,
          discountType: 'fixed',
          discountValue: 200,
          discountAmount: couponDiscount,
          message: '₹200 Flat Discount Applied! 🎁',
        };
      } else {
        couponResult = {
          code,
          isValid: false,
          discountType: 'percentage',
          discountValue: 0,
          discountAmount: 0,
          message: 'Invalid Coupon Code. Try WELCOME10 or FESTIVE15.',
        };
      }
    }

    // Free shipping threshold (≥ ₹999)
    const FREE_SHIPPING_THRESHOLD = 999;
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || calculatedItems.length === 0 ? 0 : 99;
    const isFreeShipping = shippingFee === 0;

    const finalTotal = Math.max(0, subtotal - couponDiscount + shippingFee);
    const itemCount = calculatedItems.reduce((sum, i) => sum + i.quantity, 0);

    // Save active coupon to DB if cart exists
    if (cart && activeCoupon) {
      cart.couponCode = activeCoupon;
      await cart.save();
    }

    return {
      items: calculatedItems,
      summary: {
        itemCount,
        originalTotal,
        subtotal,
        productDiscount,
        couponDiscount,
        shippingFee,
        isFreeShipping,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountForFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
        finalTotal,
      },
      coupon: couponResult,
    };
  }
}
