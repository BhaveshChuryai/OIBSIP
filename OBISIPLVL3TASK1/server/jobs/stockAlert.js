/**
 * Stock Alert Job
 * Scheduled cron job that checks inventory levels every 30 minutes
 * and sends email alerts to admin if any items are below threshold.
 */
const cron = require('node-cron');
const Inventory = require('../models/Inventory');
const { sendLowStockAlert } = require('../utils/sendEmail');

/**
 * Start the stock alert cron job
 * Runs every 30 minutes
 */
const startStockAlertJob = () => {
  // Run every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('🔍 Running stock check...');

    try {
      // Find all items where quantity is at or below threshold
      const lowStockItems = await Inventory.find({
        $expr: { $lte: ['$quantity', '$threshold'] }
      });

      if (lowStockItems.length > 0) {
        console.log(`⚠️ ${lowStockItems.length} items below threshold!`);

        const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
        await sendLowStockAlert(adminEmail, lowStockItems);

        console.log('📧 Low stock alert email sent to admin');
      } else {
        console.log('✅ All stock levels are normal');
      }
    } catch (error) {
      console.error('❌ Stock alert job failed:', error.message);
    }
  });

  console.log('⏰ Stock alert cron job started (every 30 minutes)');
};

module.exports = { startStockAlertJob };
