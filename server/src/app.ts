import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import { apiLimiter } from './middleware/rateLimiter.middleware';
import { AppError } from './utils/appError';

import path from 'path';

// Import Feature Modules
import authRoutes from './modules/auth/auth.routes';
import categoryRoutes from './modules/categories/category.routes';
import productRoutes from './modules/products/product.routes';
import orderRoutes from './modules/orders/order.routes';
import adminRoutes from './modules/admin/admin.routes';
import uploadRoutes from './modules/upload/upload.routes';
import productTypeRoutes from './modules/product-types/product-type.routes';
import collectionRoutes from './modules/collections/collection.routes';
import themeRoutes from './modules/themes/theme.routes';
import seedRoutes from './modules/seed/seed.routes';
import cartRoutes from './modules/cart/cart.routes';
import attributeRoutes from './modules/attributes/attribute.routes';
import inventoryRoutes from './modules/inventory/inventory.routes';
import marketingRoutes from './modules/marketing/marketing.routes';
import paymentRoutes from './modules/payments/payment.routes';

const app: Application = express();

// Serve uploaded static files
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Security HTTP Headers
app.use(helmet());

// Logging in dev mode
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// CORS setup
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        env.NODE_ENV === 'development' ||
        origin === env.CLIENT_URL ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.includes('192.168.') ||
        origin.includes('10.')
      ) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Body Parser & Cookie Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// NoSQL Injection Sanitization
app.use(mongoSanitize());

// Global Rate Limiting
app.use('/api', apiLimiter);

// Health Check
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'BatalaBandi API Server is healthy and operational 🚀',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/product-types', productTypeRoutes);
app.use('/api/v1/collections', collectionRoutes);
app.use('/api/v1/themes', themeRoutes);
app.use('/api/v1/seed', seedRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/attributes', attributeRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/marketing', marketingRoutes);
app.use('/api/v1/payments', paymentRoutes);

// Unhandled Route Handler
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Middleware
app.use(errorHandler);

export default app;
