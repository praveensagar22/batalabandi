import mongoose from 'mongoose';
import { env } from './env';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);

    // Auto-fix any legacy orders with null or missing orderNumber to prevent E11000 index conflicts
    try {
      const db = conn.connection.db;
      if (db) {
        const ordersColl = db.collection('orders');
        const legacyNullOrders = await ordersColl
          .find({
            $or: [{ orderNumber: null }, { orderNumber: { $exists: false } }],
          })
          .toArray();

        if (legacyNullOrders.length > 0) {
          console.log(`🛠️ Repairing ${legacyNullOrders.length} legacy order(s) missing orderNumber...`);
          for (let i = 0; i < legacyNullOrders.length; i++) {
            const newOrderNum = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}-${i + 1}`;
            await ordersColl.updateOne(
              { _id: legacyNullOrders[i]._id },
              { $set: { orderNumber: newOrderNum } }
            );
          }
          console.log('✅ Legacy orders repaired with unique order numbers');
        }
      }
    } catch (repairErr) {
      console.warn('⚠️ Legacy order repair warning:', repairErr);
    }
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
