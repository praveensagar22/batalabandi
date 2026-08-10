import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/batalabandi'),
  JWT_ACCESS_SECRET: z.string().default('batalabandi_access_secret_super_secure_key_2026'),
  JWT_REFRESH_SECRET: z.string().default('batalabandi_refresh_secret_super_secure_key_2026'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  RAZORPAY_KEY_ID: z.string().default('rzp_test_TOAoM0QDJ1iiw4'),
  RAZORPAY_KEY_SECRET: z.string().default('ENCdcFXYGi4xayYKzBfbKwc5'),
  RAZORPAY_WEBHOOK_SECRET: z.string().default('batalabandi_webhook_secret_2026'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
